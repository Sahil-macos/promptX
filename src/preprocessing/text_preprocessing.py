import re


def preprocess_text(text):
    if not isinstance(text, str):
        text = str(text)

    # Replace newlines and tabs with spaces
    text = text.replace("\n", " ")
    text = text.replace("\t", " ")

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text)

    # Remove special characters that might not be in vocabulary
    # Keep only alphanumeric, basic punctuation, and spaces
    text = re.sub(r"[^\w\s\.,!?;:'\"-]", " ", text)

    # Remove multiple spaces again after character removal
    text = re.sub(r"\s+", " ", text)

    text = text.strip()

    text = text.lower()

    return text


if __name__ == "__main__":
    text = input("Enter text: ")

    processed_text = preprocess_text(text)

    print("\nOriginal text:")
    print(text)

    print("\nPreprocessed text:")
    print(processed_text)