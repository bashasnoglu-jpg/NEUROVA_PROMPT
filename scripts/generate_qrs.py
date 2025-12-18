import qrcode

TARGETS = {
    "prompt_library": "http://127.0.0.1:5500/prompt-library.html",
    "staff_tr": "file:///C:/Users/tourg/OneDrive/Masa%C3%BCst%C3%BC/NEUROVA_PROMPT/printed-guides/hamam-cleaning-tr.pdf",
    "staff_en": "file:///C:/Users/tourg/OneDrive/Masa%C3%BCst%C3%BC/NEUROVA_PROMPT/printed-guides/hamam-cleaning-en.pdf",
    "reception_playbook": "file:///C:/Users/tourg/OneDrive/Masa%C3%BCst%C3%BC/NEUROVA_PROMPT/printed-guides/reception-sales-playbook-v1.pdf",
}


def build_qr(name, url):
    img = qrcode.make(url)
    img.save(f"printed-guides/{name}.png")


def main():
    for key, url in TARGETS.items():
        build_qr(key, url)


if __name__ == "__main__":
    main()
