import os
import re
import io
import asyncio
import numpy as np
import base64
import smtplib
import pandas as pd
from typing import Optional, Tuple, Dict
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Matplotlib writable config directory & headless backend
base_dir = os.path.dirname(os.path.abspath(__file__))
os.environ["MPLCONFIGDIR"] = os.path.join(base_dir, ".matplotlib_cache")
os.makedirs(os.environ["MPLCONFIGDIR"], exist_ok=True)

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Machine Learning imports for clustering
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

# Export & Email libraries
import markdown
from email.message import EmailMessage

# Import Google Antigravity SDK
from google.antigravity import Agent, LocalAgentConfig

# Import Advanced PII Sanitizer
from sanitizer import AdvancedPIIScrubber

app = FastAPI(title="Groww Pulse API", description="FastAPI Backend with Explicit Matplotlib Sizing & WeasyPrint Image Styling")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize global scrubber instance
scrubber = AdvancedPIIScrubber()

# Role Directives Dictionary
ROLE_DIRECTIVES = {
    'Product': "Focus heavily on emerging bugs, feature requests, and onboarding bottlenecks. Your goal is to help the team decide what to build or fix next.",
    'Support': "Focus heavily on dominant user sentiment and the most common complaints. Your goal is to ensure support reps are aligned with user frustrations.",
    'Leadership': "Focus heavily on a high-level strategic health pulse of the application's standing in the public markets. Keep insights strategic."
}

def get_role_directive(role: str) -> str:
    r = role.lower()
    if 'product' in r or 'growth' in r:
        return ROLE_DIRECTIVES['Product']
    elif 'support' in r:
        return ROLE_DIRECTIVES['Support']
    else:
        return ROLE_DIRECTIVES['Leadership']

def get_groww_logo_base64() -> str:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(base_dir)
    logo_png = os.path.join(root_dir, "Groww", "Groww_Groww_White_Logo_copy_1.png")
    logo_svg = os.path.join(root_dir, "Groww", "Groww_Groww_White_Logo_copy_0.svg")
    
    if os.path.exists(logo_png):
        with open(logo_png, "rb") as f:
            return f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"
    elif os.path.exists(logo_svg):
        with open(logo_svg, "rb") as f:
            return f"data:image/svg+xml;base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return ""

def load_and_clean_csv(file_path: str) -> pd.DataFrame:
    if not os.path.isabs(file_path):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, file_path)
        
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file not found at: {file_path}")
        
    df = pd.read_csv(file_path)
    df_clean = scrubber.clean_dataframe(df)
    return df_clean

def cluster_reviews(df: pd.DataFrame, num_clusters: int = 5) -> Tuple[pd.DataFrame, str]:
    df_clustered = df.copy()
    
    text_col = None
    for col in ['Review Text', 'review_text', 'review', 'Text', 'text']:
        if col in df_clustered.columns:
            text_col = col
            break
            
    if not text_col:
        text_cols = df_clustered.select_dtypes(include=['object']).columns
        if len(text_cols) > 0:
            text_col = text_cols[0]
        else:
            raise ValueError("No text column found in DataFrame for clustering")
            
    texts = df_clustered[text_col].fillna("").astype(str).tolist()
    n_samples = len(texts)
    actual_clusters = min(num_clusters, max(1, n_samples))
    
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(texts)
    
    kmeans = KMeans(n_clusters=actual_clusters, random_state=42, n_init=10)
    kmeans.fit(tfidf_matrix)
    
    cluster_labels = [f"Cluster {label + 1}" for label in kmeans.labels_]
    df_clustered['Theme_Cluster'] = cluster_labels
    
    cluster_summary_lines = []
    for cluster_id in range(actual_clusters):
        c_label = f"Cluster {cluster_id + 1}"
        cluster_df = df_clustered[df_clustered['Theme_Cluster'] == c_label]
        sample_reviews = cluster_df[text_col].head(4).tolist()
        
        cluster_summary_lines.append(f"=== {c_label} (Count: {len(cluster_df)} reviews) ===")
        for idx, rev in enumerate(sample_reviews, 1):
            cluster_summary_lines.append(f"  {idx}. {rev}")
        cluster_summary_lines.append("")
        
    formatted_summary = "\n".join(cluster_summary_lines)
    return df_clustered, formatted_summary

# Step 1: Explicit Figure Sizing (7x3.5, 300 DPI)
def generate_pdf_charts(role: str = "Product") -> Dict[str, str]:
    """
    Generates Matplotlib figure with explicit size (7, 3.5) and 300 DPI for Platform Diagnostics.
    Saves to BytesIO buffer, encodes as base64 data string, and closes the figure.
    """
    fig, ax = plt.subplots(figsize=(7, 3.5), dpi=300, facecolor='#111827')
    ax.set_facecolor('#111827')
    
    categories = ['Negative', 'Neutral', 'Positive']
    android = [520, 110, 2]
    ios = [208, 39, 1]
    
    x = np.arange(len(categories))
    width = 0.35
    
    rects1 = ax.bar(x - width/2, android, width, label='Android', color='#00d09c')
    rects2 = ax.bar(x + width/2, ios, width, label='iOS', color='#6366f1')
    
    ax.set_title(f'Platform Diagnostics ({role} Perspective)', color='#f3f4f6', fontsize=11, pad=12, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(categories, color='#94a3b8', fontsize=9)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    ax.legend(facecolor='#1f293d', edgecolor='none', labelcolor='#f3f4f6', fontsize=9)
    
    for spine in ax.spines.values():
        spine.set_color('#1f293d')
        
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    buf.seek(0)
    
    bar_b64 = base64.b64encode(buf.read()).decode('utf-8')
    graph_data_url = f"data:image/png;base64,{bar_b64}"

    return {
        "graph_base64": graph_data_url,
        "bar_chart": graph_data_url
    }

# Step 1 & 4: PDF Generator with Explicit WeasyPrint Image Styling
def generate_pdf(md_text: str, role: str, charts_b64: Optional[Dict[str, str]] = None) -> str:
    """
    Renders PDF document with explicit WeasyPrint <img> block styling:
    style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto;"
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    exports_dir = os.path.join(base_dir, "exports")
    os.makedirs(exports_dir, exist_ok=True)
    pdf_path = os.path.join(exports_dir, "Weekly_Pulse.pdf")

    logo_b64 = get_groww_logo_base64()

    if not charts_b64:
        charts_b64 = generate_pdf_charts(role)

    graph_base64 = charts_b64.get("graph_base64", charts_b64.get("bar_chart", ""))

    html_body = markdown.markdown(md_text)
    logo_html = f'<img src="{logo_b64}" class="logo-img" alt="Groww Logo" />' if logo_b64 else '<span class="brand-text">Groww</span>'

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page {{ size: A4; margin: 0; }}
    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; background: #ffffff; }}
    .header-banner {{ background-color: #0b0f19; padding: 22px 32px; border-bottom: 4px solid #00d09c; }}
    .brand-row {{ display: flex; align-items: center; justify-content: space-between; }}
    .logo-img {{ height: 28px; width: auto; vertical-align: middle; }}
    .brand-text {{ font-size: 24px; font-weight: bold; color: #ffffff; }}
    .brand-accent {{ color: #00d09c; font-weight: 300; font-size: 18px; text-transform: lowercase; margin-left: 6px; }}
    .role-subheader {{ font-size: 13px; font-weight: 600; color: #00d09c; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }}
    .container {{ padding: 24px 32px; }}
    .chart-box {{ text-align: center; background: #0b0f19; padding: 16px; border-radius: 8px; border: 1px solid #1f293d; margin-bottom: 20px; }}
    .content {{ font-size: 13px; line-height: 1.6; color: #334155; }}
    h1, h2, h3 {{ color: #0f172a; border-left: 4px solid #00d09c; padding-left: 10px; margin-top: 18px; font-size: 15px; font-weight: bold; }}
    ul, ol {{ padding-left: 20px; }}
    li {{ margin-bottom: 6px; }}
    blockquote {{ background: #f8fafc; border-left: 4px solid #6366f1; padding: 10px 14px; margin: 12px 0; font-style: italic; color: #334155; border-radius: 0 6px 6px 0; }}
    .footer {{ margin-top: 28px; border-top: 1px solid #e2e8f0; padding: 14px 32px; font-size: 10px; color: #64748b; text-align: center; background: #f8fafc; }}
  </style>
</head>
<body>
  <div class="header-banner">
    <div class="brand-row">
      <div>
        {logo_html}
        <span class="brand-accent">pulse</span>
      </div>
    </div>
    <div class="role-subheader">Weekly Insights Report tailored for the {role} Team</div>
  </div>

  <div class="container">
    <div class="chart-box">
      <img src="{graph_base64}" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto;" alt="Platform Diagnostics Graph" />
    </div>

    <div class="content">
      {html_body}
    </div>
  </div>

  <div class="footer">
    Generated automatically by Groww Pulse AI Insights Engine • 100% Zero PII Sanitized
  </div>
</body>
</html>
"""

    try:
        import weasyprint
        weasyprint.HTML(string=html_content).write_pdf(pdf_path)
    except Exception:
        from fpdf import FPDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", size=14)
        pdf.cell(0, 10, txt=f"Groww pulse - {role} Team Report", ln=1, align="C")
        pdf.set_font("Helvetica", size=10)
        pdf.cell(0, 8, txt="Weekly Insights Report", ln=1, align="C")
        pdf.ln(8)
        
        pdf.set_font("Helvetica", size=10)
        clean_text = md_text.replace("**", "").replace("•", "-").replace("“", '"').replace("”", '"').replace("’", "'")
        for line in clean_text.split("\n"):
            line_str = line.strip().encode('ascii', errors='ignore').decode('ascii')
            if line_str:
                pdf.multi_cell(0, 6, txt=line_str)
                pdf.ln(1)
                
        pdf.output(pdf_path)

    return pdf_path

def send_smtp_dispatch(msg: EmailMessage) -> str:
    smtp_email = os.environ.get("SMTP_EMAIL")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    smtp_server = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", 465))
    
    if smtp_email and smtp_password:
        try:
            with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
                server.login(smtp_email, smtp_password)
                server.send_message(msg)
            return "Live Branded HTML email sent successfully via SMTP!"
        except Exception as smtp_err:
            return f"Branded HTML Email drafted & PDF attached (SMTP attempt: {str(smtp_err)})"
    else:
        return "Branded HTML Email drafted & PDF generated successfully! (Add SMTP_EMAIL and SMTP_PASSWORD to .env for live sending)"

class WeeklyPulseRequest(BaseModel):
    role: Optional[str] = "Lead Insights Analyst"
    csv_file_path: Optional[str] = "reviews.csv"

class SanitizeRequest(BaseModel):
    raw_text: str

class SendEmailRequest(BaseModel):
    role: str
    email: str

@app.get("/")
def read_root():
    return {
        "message": "Groww Pulse API is running",
        "status": "active",
        "phase": "Explicit Matplotlib Figure Sizing (7x3.5, 300 DPI) & WeasyPrint Image Styling"
    }

@app.post("/test-sanitization")
def test_sanitization(request: SanitizeRequest):
    sanitized_text = scrubber.scrub_text(request.raw_text)
    return {
        "raw_text": request.raw_text,
        "sanitized_text": sanitized_text
    }

@app.get("/api/library/download")
def download_library_csv():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "library", "reviews.csv")
    
    if not os.path.exists(csv_path):
        csv_path = os.path.join(base_dir, "reviews.csv")
        
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="Library reviews.csv file not found")
        
    return FileResponse(
        path=csv_path,
        filename="groww_sanitized_reviews_wk17.csv",
        media_type="text/csv"
    )

@app.post("/generate-weekly-pulse")
async def generate_weekly_pulse(request: WeeklyPulseRequest):
    try:
        df_clean = load_and_clean_csv(request.csv_file_path)
        df_clustered, cluster_summary = cluster_reviews(df_clean, num_clusters=5)
        charts_b64 = await asyncio.to_thread(generate_pdf_charts, request.role)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV or clustering: {str(e)}")

    role_directive = get_role_directive(request.role)

    system_prompt = (
        "You are the Lead Insights Analyst for Groww pulse. Your job is to analyze raw, public app reviews "
        f"and generate a highly scannable weekly pulse report tailored for the stakeholder role: {request.role}.\n\n"
        f"ROLE DIRECTIVE MANDATE:\n{role_directive}\n\n"
        "STRICT CONSTRAINTS:\n"
        "1. MAX LENGTH: Your entire final output MUST NOT exceed 250 words.\n"
        "2. THEME LIMIT: The data is pre-clustered into 5 distinct themes. Analyze these clusters to determine the Top 3 most urgent themes.\n"
        "3. ZERO PII: All user quotes must have PII heavily redacted ([EMAIL REDACTED], [PHONE REDACTED], [USERNAME REDACTED], [ID REDACTED], [REDACTED]).\n"
        "4. TONE: Professional, objective, direct, and actionable.\n\n"
        "OUTPUT FORMAT REQUIREMENTS:\n"
        "- **Top 3 Themes**: [Brief summary of the 3 most frequent/urgent themes curated for this role lens]\n"
        "- **Real User Quotes**: [Exactly 3 direct, PII-scrubbed quotes that represent the top themes]\n"
        "- **Action Ideas**: \n"
        "  - Product/Growth: [1 specific action]\n"
        "  - Support: [1 specific action]\n"
        "  - Leadership: [1 specific action]"
    )

    config = LocalAgentConfig(
        system_instructions=system_prompt,
        model="gemini-2.5-flash"
    )

    user_prompt = (
        f"Stakeholder Role: {request.role}\n"
        f"Role Directive Guidance: {role_directive}\n\n"
        "The data is pre-clustered into 5 distinct themes. Analyze these clusters to determine the Top 3 most urgent themes for this role lens.\n\n"
        f"Pre-Clustered Reviews Dataset Summary:\n{cluster_summary[:3500]}"
    )

    async with Agent(config) as agent:
        response = await agent.chat(user_prompt)
        report_text = await response.text()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    report_file_path = os.path.join(base_dir, "Weekly_Pulse_Report.md")
    
    with open(report_file_path, "w", encoding="utf-8") as f:
        f.write(report_text)

    pdf_file_path = await asyncio.to_thread(generate_pdf, report_text, request.role, charts_b64)

    return {
        "status": "success",
        "role": request.role,
        "saved_report_path": report_file_path,
        "saved_pdf_path": pdf_file_path,
        "report": report_text
    }

@app.post("/api/send-pulse-email")
async def send_pulse_email(request: SendEmailRequest):
    try:
        df_clean = load_and_clean_csv("reviews.csv")
        df_clustered, cluster_summary = cluster_reviews(df_clean, num_clusters=5)
        charts_b64 = await asyncio.to_thread(generate_pdf_charts, request.role)
        
        role_directive = get_role_directive(request.role)

        system_prompt = (
            f"You are the Lead Insights Analyst for Groww pulse. Generate a highly scannable weekly pulse report "
            f"tailored for the {request.role} Team under 250 words with Top 3 themes, 3 PII-scrubbed quotes, and 3 action ideas.\n"
            f"ROLE DIRECTIVE: {role_directive}"
        )
        
        config = LocalAgentConfig(system_instructions=system_prompt, model="gemini-2.5-flash")
        user_prompt = f"Role: {request.role}\nDirective: {role_directive}\nReviews:\n{cluster_summary[:3500]}"
        
        async with Agent(config) as agent:
            response = await agent.chat(user_prompt)
            report_text = await response.text()
            
        pdf_path = await asyncio.to_thread(generate_pdf, report_text, request.role, charts_b64)
        
        raw_html = markdown.markdown(report_text)
        bold_header_style = 'font-weight: bold; font-size: 24px; color: #1a1a1a; margin-top: 20px; margin-bottom: 8px; border-left: 4px solid #00d09c; padding-left: 8px;'
        
        styled_html = raw_html \
            .replace('<h2>Top 3 Themes</h2>', f'<h2 style="{bold_header_style}">Top 3 Themes</h2>') \
            .replace('<h2>Real User Quotes</h2>', f'<h2 style="{bold_header_style}">Real User Quotes</h2>') \
            .replace('<h2>Action Ideas</h2>', f'<h2 style="{bold_header_style}">Action Ideas</h2>') \
            .replace('<strong>Top 3 Themes</strong>', f'<h2 style="{bold_header_style}">Top 3 Themes</h2>') \
            .replace('<strong>Real User Quotes</strong>', f'<h2 style="{bold_header_style}">Real User Quotes</h2>') \
            .replace('<strong>Action Ideas</strong>', f'<h2 style="{bold_header_style}">Action Ideas</h2>')

        email_html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }}
    .email-container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }}
    .email-header {{ background-color: #1a1a1a; padding: 20px 24px; border-bottom: 3px solid #00d09c; }}
    .brand-title {{ font-size: 22px; font-weight: bold; color: #ffffff; margin: 0; letter-spacing: -0.5px; }}
    .brand-accent {{ color: #00d09c; font-weight: 300; text-transform: lowercase; font-size: 18px; margin-left: 4px; }}
    .email-body {{ padding: 24px; font-size: 13px; line-height: 1.6; color: #334155; }}
    .greeting {{ font-size: 15px; font-weight: bold; color: #0f172a; margin-bottom: 8px; }}
    .punchy-intro {{ font-size: 13px; color: #64748b; margin-bottom: 16px; font-weight: 500; }}
    .report-card {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 16px 0; color: #1e293b; }}
    .report-card ul, .report-card ol {{ padding-left: 18px; margin: 8px 0; }}
    .report-card li {{ margin-bottom: 6px; }}
    .report-card blockquote {{ background: #ffffff; border-left: 3px solid #6366f1; padding: 8px 12px; margin: 10px 0; font-style: italic; color: #475569; border-radius: 0 4px 4px 0; }}
    .attachment-note {{ background: rgba(0, 208, 156, 0.1); border: 1px solid rgba(0, 208, 156, 0.3); color: #008765; padding: 12px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; margin-top: 18px; text-align: center; }}
    .email-footer {{ background: #f8fafc; padding: 14px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="brand-title">Groww<span class="brand-accent">pulse</span></div>
    </div>
    <div class="email-body">
      <div class="greeting">Hello {request.role} Team,</div>
      <div class="punchy-intro">Here is your visual weekly pulse report tailored for the {request.role} team.</div>
      
      <div class="report-card">
        {styled_html}
      </div>

      <div class="attachment-note">
        📎 Please find your detailed, visual Weekly Pulse report attached as a PDF document.
      </div>
    </div>
    <div class="email-footer">
      Sent automatically by Groww Pulse AI Insights Engine • 100% Zero PII Sanitized
    </div>
  </div>
</body>
</html>
"""

        msg = EmailMessage()
        msg['Subject'] = f"Your Groww Pulse Weekly Report - {request.role} Team"
        msg['From'] = os.environ.get("SMTP_EMAIL", "pulse-insights@groww.in")
        msg['To'] = request.email
        
        msg.set_content(email_html_body, subtype='html')
        
        if os.path.exists(pdf_path):
            with open(pdf_path, 'rb') as f:
                file_data = f.read()
                msg.add_attachment(file_data, maintype='application', subtype='pdf', filename='Weekly_Pulse.pdf')
                
        dispatch_status = await asyncio.to_thread(send_smtp_dispatch, msg)

        return {
            "status": "success",
            "message": dispatch_status,
            "pdf_path": pdf_path,
            "target_email": request.email,
            "role": request.role
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process email automation: {str(e)}")
