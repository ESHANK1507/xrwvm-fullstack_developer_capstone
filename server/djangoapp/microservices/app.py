import json
import os
import zipfile
from flask import Flask
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask("Sentiment Analyzer")

# Ensure bundled VADER lexicon is available offline
base_dir = os.path.dirname(os.path.abspath(__file__))
local_nltk_dir = os.path.join(base_dir, "nltk_data")
lexicon_dir = os.path.join(local_nltk_dir, "sentiment")
zip_path = os.path.join(base_dir, "sentiment", "vader_lexicon.zip")
if os.path.exists(zip_path) and not os.path.exists(
    os.path.join(lexicon_dir, "vader_lexicon")
):
    os.makedirs(lexicon_dir, exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(lexicon_dir)
if os.path.exists(local_nltk_dir):
    nltk.data.path.insert(0, local_nltk_dir)

sia = SentimentIntensityAnalyzer()


@app.get('/')
def home():
    return (
        "Welcome to the Sentiment Analyzer. "
        "Use /analyze/text to get the sentiment"
    )


@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):
    scores = sia.polarity_scores(input_txt)
    print(scores)
    pos = float(scores['pos'])
    neg = float(scores['neg'])
    neu = float(scores['neu'])
    res = "positive"
    print("pos neg neu ", pos, neg, neu)
    if neg > pos and neg > neu:
        res = "negative"
    elif neu > neg and neu > pos:
        res = "neutral"
    res = json.dumps({"sentiment": res})
    print(res)
    return res


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    app.run(host="0.0.0.0", port=port, debug=False)
