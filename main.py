import os
from pdf2image import convert_from_path
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
import logging
from logging.handlers import RotatingFileHandler
import pytesseract as tess
if os.name == 'nt':
    tess.pytesseract.tesseract_cmd = r'Tesseract-OCR\tesseract.exe'
from PIL import Image

dir_path = os.path.dirname(os.path.realpath(__file__))
UPLOAD_FOLDER = dir_path + '/static/images'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
file_EXTENSIONS = set(['pdf'])
app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def pdf_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in file_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    # print("ARGS:",request.args,"---")
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            if pdf_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                app.logger.info('File name  %s', filename)
                pdf_data = 'static/images/'+ filename
                pdf_text=""
                langToProcess = ""
                pages = convert_from_path(pdf_data, poppler_path= r'poppler/bin')
                if request.form.get("English"):
                    langToProcess = 'eng'
                elif request.form.get("Telugu"):
                    langToProcess = 'tel'
                else:
                    langToProcess = 'urdu'
                for page in pages:
                    app.logger.info('Text  %s', pdf_text)

                    text = tess.image_to_string(page, lang =langToProcess)
                    pdf_text += text
                    
                return render_template('success.html', filename = filename, text=pdf_text)
            else:

                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                img = Image.open('static/images/' + filename)

                # set language for processing
                if request.form.get("English"):
                    langToProcess = 'eng'
                elif request.form.get("Telugu"):
                    langToProcess = 'tel'
                else:
                    langToProcess = 'urdu'

                text = tess.image_to_string(img, lang=langToProcess)
                src = '../static/images/' + filename
                return render_template('success.html', filename=filename, text=text, img=img, src=src)
    return render_template('index.html')


if __name__ == '__main__':
    app.debug = True
    app.run()
