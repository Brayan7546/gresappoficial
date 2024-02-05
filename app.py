from flask import Flask, render_template, request, redirect, url_for, flash
import pandas as pd
from flask_bootstrap import Bootstrap

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu_clave_secreta'
bootstrap = Bootstrap(app)

def validar_archivo(data):
    if len(data.columns) == 2 and 'CJ' in data.columns and 'Nombre_Equipo' in data.columns:
        return True
    else:
        return False

def agregar_mec(data):
    data['MEC'] = ''
    return data

# Inicializa el diccionario 'grouped_data'
grouped_data = {}

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/cargarArchivo', methods=['GET', 'POST'])
def cargarArchivo():
    global grouped_data

    if request.method == 'POST':
        f = request.files['file']
        try:
            data = pd.read_excel(f) 
            if validar_archivo(data):
                data = agregar_mec(data)

                # Almacena los datos en el diccionario usando el CJ como clave
                for _, row in data.iterrows():
                    cj = str(row['CJ'])
                    grouped_data[cj] = {
                        'Nombre_Equipo': row['Nombre_Equipo'],
                        'MEC': '',
                        'decisionPath': ''
                    }

                # Filtra las filas donde el valor de 'CJ' termina en '1'
                base_data = data[data['CJ'].astype(str).str.endswith('1')]
                filtered_data = base_data[['CJ', 'Nombre_Equipo', 'MEC']]

                return render_template('loaded.html', data=filtered_data.to_dict(orient='records'), grouped_data=grouped_data)
            else:
                flash('Formato incorrecto', 'error')
        except Exception as e:
            flash(f'Error: {e}', 'error')

    return render_template('index.html')

USERS = {
    'admin': {'password': 'adminpass'},
    '@cotecmar.com': {'password': 'cotecmarpass'},
}

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username in USERS and USERS[username]['password'] == password:
            return redirect (url_for('cargarArchivo'))
        else:
            flash("Usuario no encontrado o contraseña inválida...")
            return render_template('auth/login.html')
    else:
        return render_template('auth/login.html')

@app.route('/loaded')
def loaded():
    if 'all_data' not in locals():
        all_data = []
    return render_template('loaded.html', all_data=all_data)

if __name__ == '__main__':
    app.run(debug=True)
