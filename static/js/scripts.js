function validateForm() {
    var fileInput = document.getElementById('file');
    var submitBtn = document.getElementById('submitBtn');
  
    if (fileInput.files.length === 0) {
      alert('Por favor, adjunta un archivo antes de hacer clic en Subir.');
      return false;
    }
  
    return true;
  }
  
document.getElementById('file').addEventListener('change', function () {
  var submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = false;
});

 // Toma los datos completos enviados desde el servidor
 var groupedData = JSON.parse('{{ grouped_data | tojson | safe }}');

 document.querySelectorAll('.edit-btn').forEach(function(row) {
     row.addEventListener('click', function() {
         // Remover la clase 'selected-row' de todas las filas
         document.querySelectorAll('.edit-btn').forEach(function(row) {
             row.classList.remove('selected-row');
         });

         // Añadir la clase 'selected-row' a la fila seleccionada
         row.classList.add('selected-row');

         var cj = row.querySelector('td:nth-child(1)').innerText;
         var nombreEquipo = row.querySelector('td:nth-child(2)').innerText;

         // Crear el formulario con los datos de la fila
         var formHTML = `
             <form id="editForm" class="row g-3">
                 <div class="col-md-2">
                     <label for="cjInput" class="form-label">CJ</label>
                     <input type="text" class="form-control" id="cjInput" value="${cj}" readonly>
                 </div>
                 <div class="col-md-10">
                     <label for="nombreEquipoInput" class="form-label">Nombre Equipo</label>
                     <input type="text" class="form-control" id="nombreEquipoInput" value="${nombreEquipo}">
                 </div>
                 <div class="col-12">
                     <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                 </div>
             </form>
             
             <div class="mt-4" id="childTeamsContainer">
                 <!-- La tabla de equipos hijos se generará aquí -->
             </div>
         `;

         document.getElementById('infoform').innerHTML = formHTML;

         // Obtener los primeros 4 caracteres de 'CJ'
         var cjPrefix = cj.substring(0, 4);

         // Filtrar los 'equipos hijos' basados en los 4 primeros números de 'CJ'
         var childTeams = groupedData[cjPrefix] || [];

         // Generar filas HTML para la tabla de 'equipos hijos'
         var childRowsHtml = childTeams.map(function(team) {
             return `<tr><td>${team['CJ']}</td><td>${team['Nombre_Equipo']}</td></tr>`;
         }).join('');

         // Actualizar la segunda tabla con las filas filtradas
         var childTableHtml = `
             <h3>Equipos Hijos</h3>
             <table class="table table-hover">
                 <thead>
                     <tr>
                         <th>CJ</th>
                         <th>Nombre Equipo</th>
                     </tr>
                 </thead>
                 <tbody>
                     ${childRowsHtml}
                 </tbody>
             </table>
         `;

         document.getElementById('childTeamsContainer').innerHTML = childTableHtml;

         document.getElementById('editForm').addEventListener('submit', function (event) {
             event.preventDefault();
             // Aquí puedes agregar lógica para enviar el formulario a través de AJAX o hacer lo que necesites
             console.log('Formulario enviado');
         });
     });
 });

 // Función para manejar la búsqueda en tiempo real y el filtrado de la primera tabla
 document.getElementById('searchInput').addEventListener('input', function () {
     var searchTerm = this.value.toLowerCase();
     var rows = document.querySelectorAll('#dataTable tbody tr');

     rows.forEach(function (row) {
         var cj = row.querySelector('td:nth-child(1)').innerText.toLowerCase();
         var nombreEquipo = row.querySelector('td:nth-child(2)').innerText.toLowerCase();

         if (cj.endsWith('1') && (cj.includes(searchTerm) || nombreEquipo.includes(searchTerm))) {
             row.style.display = '';
         } else {
             row.style.display = 'none';
         }
     });
 });

 

 