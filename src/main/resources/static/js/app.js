var app = (function(){

    var selectedAuthor = null;
    var selectedBlueprints = [];

    function updateBlueprints() {
        if (selectedAuthor) {
            apimock.getBlueprintsByAuthor(selectedAuthor, function (bps) {
                selectedBlueprints = [];
                for (var i = 0; i < bps.length; i++) {
                    var plano = bps[i];
                    var nuevo = {
                        nombre: plano.name,
                        numPuntos: plano.points.length
                    };
                    selectedBlueprints.push(nuevo);
                }
            });
        } else {
            selectedBlueprints = [];
        }
    }


        return {
            getBlueprintsByAuthor: function (authname, callback) {
                apimock.getBlueprintsByAuthor(authname, callback);
            },

            getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
                apimock.getBlueprintsByAuthor(authname, function (bps) {
                    callback(bps.find(function (e) { return e.name === bpname }));
                });
            },

            setSelectedAuthor: function (authname) {
                selectedAuthor = authname;
                updateBlueprints();
            },

            getSelectedAuthor: function () {
                return selectedAuthor;
            },

            getSelectedBlueprints: function () {
                return selectedBlueprints;
            },

             updateBlueprintsTable: function (authname) {
                        selectedAuthor = authname;

                        apimock.getBlueprintsByAuthor(authname, function (bps) {
                            // 1. Transformar con map
                            let transformed = bps.map(function (bp) {
                                return {
                                    nombre: bp.name,
                                    numPuntos: bp.points.length
                                };
                            });

                            // Guardar en estado
                            selectedBlueprints = transformed;

                            // 2. Limpiar tabla antes de llenarla
                            $("#tableBlueprints tbody").empty();

                            // 3. Agregar filas a la tabla con otro map
                            transformed.map(function (bp) {
                                let row = `<tr><td>${bp.nombre}</td><td>${bp.numPuntos}</td></tr>`;
                                $("#tableBlueprints tbody").append(row);
                            });

                            // 4. Calcular total de puntos con reduce
                            let total = transformed.reduce(function (acc, bp) {
                                return acc + bp.numPuntos;
                            }, 0);

                            // 5. Actualizar el DOM
                            $("#totalPoints").text(total);
                            // 6. Mostrar autor en la cabecera
                            $("#authorName").text(authname);
                        });
                    }
                };
})();