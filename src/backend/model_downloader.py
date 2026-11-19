
from pathlib import Path
import shutil
from huggingface_hub import hf_hub_download

PROJECT_ROOT = Path(__file__).resolve().parents[2]

REPO_ID = "Sahilbaliyan21/PromptX"

FILES = {
    "model1/mvnet_best.pt": "models/model1/saved_model/mvnet_best.pt",
    "model1/word_vocab.json": "models/model1/saved_model/word_vocab.json",
    "model1/char_vocab.json": "models/model1/saved_model/char_vocab.json",
    "model2/config.json": "models/model2/saved_model/config.json",
    "model2/model.safetensors": "models/model2/saved_model/model.safetensors",
    "model2/tokenizer.json": "models/model2/saved_model/tokenizer.json",
    "model2/tokenizer_config.json": "models/model2/saved_model/tokenizer_config.json"
}


def download_models():
    print("Checking PromptX model files...")

    for remote_file, local_file in FILES.items():
        destination = PROJECT_ROOT / local_file

        if destination.exists():
            print(f"Already available: {remote_file}")
            continue

        print(f"Downloading: {remote_file}")

        destination.parent.mkdir(parents=True, exist_ok=True)

        downloaded_path = hf_hub_download(
            repo_id=REPO_ID,
            filename=remote_file,
            repo_type="model"
        )

        shutil.copy2(downloaded_path, destination)

        print(f"Downloaded: {destination}")

    print("All PromptX model files are ready.")
