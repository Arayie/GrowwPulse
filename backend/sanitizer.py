import re
import pandas as pd
from typing import Optional

class AdvancedPIIScrubber:
    def __init__(self):
        # Email pattern
        self.email_pattern = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
        
        # Phone number pattern (10-digit Indian numbers, optional country code +91, spaces/dashes)
        self.phone_pattern = re.compile(r'(?:\+?91[\-\s]?)?\b[6-9]\d{9}\b|(?:\+?\d{1,3}[\s\-])?\(?\d{3,5}\)?[\s\-]?\d{3,5}[\s\-]?\d{3,5}')
        
        # Username / handle pattern (@user)
        self.username_pattern = re.compile(r'@[A-Za-z0-9_]+')
        
        # Explicit ID prefix pattern (e.g., ID: 123456, Account: ACC98765, ticket #987654)
        self.id_prefix_pattern = re.compile(
            r'(?i)\b(id|account|account\s+id|user\s+id|ticket|ticket\s+id|txn|transaction|ref)\s*[:#-]?\s*([A-Za-z0-9_-]{4,})'
        )
        
        # Alphanumeric ID pattern (mixed letters/digits 8+ characters, or standalone hex/UUID tokens)
        self.alphanumeric_id_pattern = re.compile(
            r'\b(?=[A-Za-z0-9]*[A-Za-z])(?=[A-Za-z0-9]*[0-9])[A-Za-z0-9]{8,}\b|\b[a-fA-F0-9]{8}-(?:[a-fA-F0-9]{4}-){3}[a-fA-F0-9]{12}\b'
        )

    def scrub_emails(self, text: str) -> str:
        return self.email_pattern.sub('[EMAIL REDACTED]', text)

    def scrub_phones(self, text: str) -> str:
        return self.phone_pattern.sub('[PHONE REDACTED]', text)

    def scrub_usernames(self, text: str) -> str:
        return self.username_pattern.sub('[USERNAME REDACTED]', text)

    def scrub_ids(self, text: str) -> str:
        # First replace explicit ID prefix occurrences (e.g. Account: ACC12345 -> Account: [ID REDACTED])
        text = self.id_prefix_pattern.sub(r'\1: [ID REDACTED]', text)
        # Then replace standalone 8+ character alphanumeric/UUID tokens
        text = self.alphanumeric_id_pattern.sub('[ID REDACTED]', text)
        return text

    def scrub_text(self, text: str) -> str:
        """
        Applies all PII scrubbing rules sequentially to the input text.
        """
        if not isinstance(text, str):
            return ""
        
        text = self.scrub_emails(text)
        text = self.scrub_phones(text)
        text = self.scrub_usernames(text)
        text = self.scrub_ids(text)
        return text

    def clean_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Automatically detects review text column in a pandas DataFrame,
        applies all regex scrubbing methods to that column, and returns the sanitized DataFrame.
        """
        df_clean = df.copy()
        
        # Detect review text column
        text_col = None
        for col in ['Review Text', 'review_text', 'review', 'Text', 'text']:
            if col in df_clean.columns:
                text_col = col
                break
                
        if text_col:
            df_clean[text_col] = df_clean[text_col].astype(str).apply(self.scrub_text)
        else:
            # Fallback: scrub all string/object columns
            for col in df_clean.select_dtypes(include=['object']).columns:
                df_clean[col] = df_clean[col].astype(str).apply(self.scrub_text)
                
        return df_clean
