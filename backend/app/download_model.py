from sentence_transformers import SentenceTransformer

def main():
    print("Downloading and caching embedding model...")
    SentenceTransformer('all-MiniLM-L6-v2')
    print("Model download complete.")

if __name__ == "__main__":
    main()