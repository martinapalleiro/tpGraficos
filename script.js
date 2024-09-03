document.addEventListener('DOMContentLoaded', () => {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(cargarGraficos);
}); 
    function cargarGraficos() {
        console.log('Cargando gráficos...');
        cargarGraficoAlumnadoPorNivel();
        cargarGraficoAsitenciaGeneral();
        cargarGraficoAsitenciaPorCurso();
        cargarGraficoEvolucionAsistencia();
        cargarGraficoCalificacionesGenerales();
        cargarGraficoCalificacionesPorCurso();
        cargarGraficoComunicados();
        
    }

    
    
    function mostrarTodos(){
        console.log('mostrando graficos')
        const charts = document.querySelectorAll('.chart-container');
        charts.forEach(chart => {
            chart.style.display = 'flex';
            
            
        })

        var navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.classList.remove('active');
        });
        var activeLink = document.querySelector(`a[href="#todos"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
        }
        
    }
    function mostrarGrafico(graficoId) {
        const charts = document.querySelectorAll('.chart-container');
        charts.forEach(chart => {            
            const chartContent = chart.querySelector('div');
            if (chartContent.id === graficoId) {

                chart.style.display = 'block'; 
                
                
    
            } else {
                chart.style.display = 'none'; 
            }
        });
        var navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.classList.remove('active');
        });
        var activeLink = document.querySelector(`a[href="#${graficoId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function cargarGraficoAlumnadoPorNivel() {
        fetch('https://apidemo.geoeducacion.com.ar/api/testing/estudiantes/1')
            .then(response => response.json())
            .then(data => {
                const niveles = {};
                data.data.forEach(estudiante => {
                    const nivel = estudiante.nivel;
                    niveles[nivel] = (niveles[nivel] || 0) + 1;
                });
                const dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Nivel');
                dataTable.addColumn('number', 'Cantidad');
                Object.keys(niveles).forEach(nivel => {
                    dataTable.addRow([nivel, niveles[nivel]]);
                });
                const options = {
                    title: 'Composición del alumnado por nivel',
                    pieHole: 0.4,
                    colors: ['#3366cc', '#dc3912', '#ff9900'],
                    width: '100%'
                    
                };

                const chart = new google.visualization.PieChart(document.getElementById('graficoAlumnadoPorNivel'));
                chart.draw(dataTable, options);
            })
            .catch(error => {
                console.error('Error al cargar la API de alumnos:', error);
            });
    }

    function cargarGraficoAsitenciaGeneral() {
        fetch('https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1')
            .then(response => response.json())
            .then(data => {
                const dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Tipo');
                dataTable.addColumn('number', 'Cantidad');

                let totalPresentes = 0;
                let totalAusentes = 0;
                data.data.forEach(item => {
                    totalPresentes += item.presentes;
                    totalAusentes += item.ausentes;
                });
                dataTable.addRow(['Presentes', totalPresentes]);
                dataTable.addRow(['Ausentes', totalAusentes]);

                const options = {
                    title: 'Nivel de asistencia general',
                    is3D: true,
                    pieSliceText: 'percentage',
                    colors: ['#3366cc', '#dc3912'],
                    width: '100%'
                };

                const chart = new google.visualization.PieChart(document.getElementById('graficoAsitenciaGeneral'));
                chart.draw(dataTable, options);
            })
            .catch(error => {
                console.error('Error al cargar la API de asistencia general:', error);
            });
    }

    function cargarGraficoAsitenciaPorCurso() {
        fetch('https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1')
            .then(response => response.json())
            .then(data => {
                const dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Curso');
                dataTable.addColumn('number', 'Presentes');
                dataTable.addColumn('number', 'Ausentes');
                data.data.forEach(item => {
                    dataTable.addRow([item.curso, item.presentes, item.ausentes]);
                });

                const options = {
                    title: 'Comparación de niveles de asistencia por curso',
                    legend: 'none',
                    hAxis: { title: 'Cantidad' },
                    vAxis: { title: 'Cursos' },
                    width: '100%'
                };

                const chart = new google.visualization.BarChart(document.getElementById('graficoAsistenciaPorCurso'));
                chart.draw(dataTable, options);
            })
            .catch(error => {
                console.error('Error al cargar la API de asistencia por curso:', error);
            });
    }

    function cargarGraficoEvolucionAsistencia() {
        fetch('https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1')
            .then(response => response.json())
            .then(data => {
                const dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Mes');
                dataTable.addColumn('number', 'Asistencia');
                data.data.forEach(item => {
                    dataTable.addRow([item.mes, item.asistencia*100]);
                });

                const options = {
                    title: 'Evolución anual de nivel de asistencia por mes',
                    legend: 'none',
                    hAxis: { title: 'Mes' },
                    vAxis: { title: 'Asistencia' },
                    width: '100%'
                };

                const chart = new google.visualization.LineChart(document.getElementById('graficoEvolucionAsistencia'));
                chart.draw(dataTable, options);
            })
            .catch(error => {
                console.error('Error al cargar la API de evolución de asistencia:', error);
            });
    }

    function cargarGraficoCalificacionesGenerales() {
        fetch('https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1')
            .then(response => response.json())
            .then(data => {
                const dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Calificación');
                dataTable.addColumn('number', 'Porcentaje');
                let aprobados = 0;
                let desaprobados = 0;
                data.data.forEach(item => {
                    aprobados += item.aprobados;
                    desaprobados += item.desaprobados;
                });
                dataTable.addRow(['Aprobados', aprobados]);
                dataTable.addRow(['Desaprobados', desaprobados]);

                const options = {
                    title: 'Nivel general de calificaciones en la institución',
                    pieHole: 0.4,
                    colors: ['#3366cc', '#dc3912'],
                    width: '100%'
                };

                const chart = new google.visualization.PieChart(document.getElementById('graficoCalificacionesGenerales'));
                chart.draw(dataTable, options);
            })
            .catch(error => {
                console.error('Error al cargar la API de calificaciones generales:', error);
            });
    }

    function cargarGraficoCalificacionesPorCurso() {
        fetch('https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1')
            .then(response => response.json())
            .then(data => {
                const dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Curso');
                dataTable.addColumn('number', 'Aprobados');
                dataTable.addColumn('number', 'Desaprobados');
                data.data.forEach(item => {
                    dataTable.addRow([item.curso, item.aprobados*100, item.desaprobados*100]);
                });

                const options = {
                    title: 'Comparativa de niveles de calificaciones por curso',
                    legend: 'none',
                    hAxis: { title: 'Cursos',
                        ticks: [0, 20, 40, 60, 80, 100],
                        format: '#\'%\'',},
                    vAxis: {   title: 'Cantidad (%)'},
                    width: '100%'
                };

                const chart = new google.visualization.ColumnChart(document.getElementById('graficoCalificacionesPorCurso'));
                chart.draw(dataTable, options);
            })
            .catch(error => {
                console.error('Error al cargar la API de calificaciones por curso:', error);
            });
    }

    function cargarGraficoComunicados() {
        fetch('https://apidemo.geoeducacion.com.ar/api/testing/comunicados/1')
            .then(response => response.json())
            .then(data => {
                    const dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('string', 'Comunicado');
                    dataTable.addColumn('number', 'Cantidad');
                    let entregados = 0;
                    let pendientes = 0;
                    let error=0;
                    if (data.data.length > 0) {
                        const item = data.data[0];
                        entregados = item.entregados;
                        pendientes = item.pendientes;
                        error = item.error;
                    }
        
                    dataTable.addRow(['Entregados', entregados]);
                    dataTable.addRow(['Pendientes', pendientes]);
                    dataTable.addRow(['Error', error]);
        
                    var options = {
                        title: 'Comparativa de niveles de comunicados',
                        legend: { position: 'none' },
                        hAxis: { title: 'Cantidad' },
                        vAxis: { title: 'Comunicado' },
                        width: '100%'
                    };
        
                    var chart = new google.visualization.BarChart(document.getElementById('graficoComunicados'));
                    chart.draw(dataTable, options);
            })
            .catch(error => {
                console.error('Error al cargar la API de comunicados:', error);
            });
        }