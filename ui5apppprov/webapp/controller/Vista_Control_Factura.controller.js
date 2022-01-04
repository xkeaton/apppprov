sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	"sap/ui/core/Fragment"
], function (Controller, FileUploader, Fragment) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Control_Factura", {
		onInit: function () {

			var oThis = this;
			oThis.getRouter().getRoute("Vista_Control_Factura").attachMatched(this._onRouteMatched, this);

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("idTableItemDetalleFac").setSelectionMode("Single");
			this.getView().byId("idTableItemDetalleFac").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemEntregado").setSelectionMode("Single");
			this.getView().byId("idTableItemEntregado").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemCronogramaEntregado").setSelectionMode("Single");
			this.getView().byId("idTableItemCronogramaEntregado").setSelectionBehavior("RowOnly");
		},

		onAfterRendering: function (oEvent) {

			/*	var oSplitApp = this.getView().byId("SplitAppDemo");
				oSplitApp.attachMasterButton(function (event) {
					if (event.getParameter("show")) {
						var button = this.byId(this.createId("SplitAppDemo-MasterBtn"));
						if (button) {
							button.setIcon("sap-icon://attachment");
						}
					}
				}.bind(this));

				oSplitApp.showMaster();*/
			var oSplitApp = this.getView().byId("SplitAppDemo");
			var oMasterNav = oSplitApp.getAggregation("_navMaster");
			oMasterNav.setVisible(false);
			// this.getView().byId("idCredenciales").addStyleClass("miBotonUsuario");
			this.getView().byId("idToolbar01").addStyleClass("miToolbar");
			this.getView().byId("idNav").addStyleClass("miIconoBlanco");
			this.getView().addStyleClass("sapUiSizeCompact");
		},
		_onRouteMatched: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			this.getView().byId("idTotalDescuentos").setValue("     ");
			this.getView().byId("idTotalIGV").setValue("     ");
			this.getView().byId("idImporteTotal").setValue("     ");

			var varOpcion = oModel.getProperty("/listOpcion/rOpcion");
			if (varOpcion === "E") {
				this.getView().byId("idTableItemEntregado").setVisible(true);
				this.getView().byId("idVizualizarDetalleEntregrado").setVisible(true);


			} else if (varOpcion === "A") {
				this.getView().byId("idTableItemEntregado").setVisible(false);
				this.getView().byId("idVizualizarDetalleEntregrado").setVisible(false);

			}

			this.getView().byId("idValidacionFacySunat1").setText("Estado del contribuyente a la fecha de emisión : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat1").setType("Information");
			this.getView().byId("idValidacionFacySunat2").setText("Estado del contribuyente a la fecha de emisión : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat2").setType("Information");
			this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat3").setType("Information");
			this.getView().byId("idValidacionFacAsig").setText("Sin items a asignar");
			this.getView().byId("idValidacionFacAsig").setType("Information");
			// Iniciar Cabecera de la factura XML
			oModel.setProperty("/listItemCabeceraFactura", []);
			var vectorCabeceraFactura = oModel.getProperty("/listItemCabeceraFactura");
			var llaveCabeceraFacLabel = [];
			llaveCabeceraFacLabel[0] = "Versión del UBL";
			//	llaveCabeceraFacLabel[1] = "Numeración de la Factura";
			llaveCabeceraFacLabel[1] = "Fecha de Emisión";
			llaveCabeceraFacLabel[2] = "Nombres o Denominación o Razón Social";
			llaveCabeceraFacLabel[3] = "Nombre Comercial";
			llaveCabeceraFacLabel[4] = "Número de RUC";
			llaveCabeceraFacLabel[5] = "Tipo de documento";
			llaveCabeceraFacLabel[6] = "Número de RUC del adquirente o usuario";
			llaveCabeceraFacLabel[7] = "Nombres o Denominación o Razón Social del adquirente o usuario";
			llaveCabeceraFacLabel[8] = "Moneda";
			llaveCabeceraFacLabel[9] = "Tasa de IGV";

			var llaveCabeceraFacValue = [];
			llaveCabeceraFacValue[0] = "-----";
			//	llaveCabeceraFacValue[1] = "-----";
			llaveCabeceraFacValue[1] = "-----";
			llaveCabeceraFacValue[2] = "-----";
			llaveCabeceraFacValue[3] = "-----";
			llaveCabeceraFacValue[4] = "-----";
			llaveCabeceraFacValue[5] = "-----";
			llaveCabeceraFacValue[6] = "-----";
			llaveCabeceraFacValue[7] = "-----";
			llaveCabeceraFacValue[8] = "-----";
			llaveCabeceraFacValue[9] = "-----";

			var llaveCabecera = {};
			for (var i = 0; i < llaveCabeceraFacValue.length; i++) {
				llaveCabecera = {};
				llaveCabecera.label = llaveCabeceraFacLabel[i];
				llaveCabecera.value = llaveCabeceraFacValue[i];
				vectorCabeceraFactura.push(llaveCabecera);
			}
			oModel.setProperty("/pages/0/description", "-Sin asignar-");
			oModel.setProperty("/listItemCabeceraFactura", vectorCabeceraFactura);

			// Borrar seleccion checks de las tablas
			var oTableEntregado = this.getView().byId("idTableItemEntregado");
			var idxEntregado = oTableEntregado.indexOfRow(1);
			oTableEntregado.setSelectedIndex(idxEntregado);

			this.getView().byId("idXML").setValue("");
			this.getView().byId("idFacturar").setEnabled(false);

			this.getView().byId("idErrores").setVisible(false);
			this.limpiarDetallePosicion();
			this.limpiarDetalleAceptado();

			var myParam = this.getView().getModel("myParam");
			var listItemFiltroEntregado = myParam.getProperty("/listItemFiltroEntregado");
			var llave = {};
			var vector = [];
			for (var i = 0; i < listItemFiltroEntregado.length; i++) {
				llave = {};
				llave.pos = listItemFiltroEntregado[i].clistItemFiltroEntregadoPosicion;
				llave.des = listItemFiltroEntregado[i].clistItemFiltroEntregadoDescripcion;
				llave.cantidad = listItemFiltroEntregado[i].clistItemFiltroEntregadoCantidad;
				llave.moneda = listItemFiltroEntregado[i].clistItemFiltroEntregadoMoneda;
				llave.valorNeto = listItemFiltroEntregado[i].clistItemFiltroEntregadoValorNeto;
				llave.descuento = listItemFiltroEntregado[i].clistItemFiltroEntregadoDescuento;
				llave.precio = listItemFiltroEntregado[i].clistItemFiltroEntregadoPrecio;
				llave.estado = listItemFiltroEntregado[i].clistItemFiltroEntregadoEstado;
				llave.descuento2 = "0";
				llave.aIngresar = "0";
				vector.push(llave);
			}
			myParam.setProperty("/listItemSeleccionado", vector);
		},

		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getSplitAppObj: function () {

			var result = this.byId("SplitAppDemo");
			if (!result) {
				jQuery.sap.log.info("SplitApp object can't be found");
			}
			return result;
		},

		btnRegresarOrdenCompra: function () {
			var oModel = this.getView().getModel("myParam");
			var documentoAdjuntos = [{
				"nombreAjd": "Documento de verificación",
				"nombreUsu": "",
				"formato": "Word",
				"fmt": "DOCX",
				"tamano": "",
				"tipo": "Obligatorio",
				"estado": "No Cargado",
				"fecha": "",
				"hora": "",
				"file": "",
				"fechaUsu": "",
				"horaUsu": ""
			}, {
				"nombreAjd": "Firma digital",
				"nombreUsu": "",
				"formato": "Imagen JPGE",
				"fmt": "JPG",
				"tamano": "",
				"tipo": "No Obligatorio",
				"estado": "No Cargado",
				"fecha": "",
				"hora": "",
				"file": "",
				"fechaUsu": "",
				"horaUsu": ""
			}, {
				"nombreAjd": "Documento de validación",
				"nombreUsu": "",
				"formato": "PDF",
				"fmt": "PDF",
				"tamano": "",
				"tipo": "Obligatorio",
				"estado": "No Cargado",
				"fecha": "",
				"hora": "",
				"file": "",
				"fechaUsu": "",
				"horaUsu": ""
			}];
			oModel.setProperty("/listDocAdjuntarOC", documentoAdjuntos);
			this.limpiarDetallePosicion();
			this.limpiarDetalleAceptado();
			this.getRouter().navTo("Vista_Orden_Compra");
		},

		change: function (e) {
			sap.ui.getCore()._file = e.getParameter("files") && e.getParameter("files")[0];
		},
		formatoCalculoDisponible: function (valor1, valor2, valor3) {
			if (valor1 === "" || valor1 === null || valor1 === undefined) {
				valor1 = "0";
			}
			if (valor2 === "" || valor2 === null || valor2 === undefined) {
				valor2 = "0";
			}
			if (valor3 === "" || valor3 === null || valor3 === undefined) {
				valor3 = "0";
			}
			valor1 = parseFloat(valor1);
			valor2 = parseFloat(valor2);
			valor3 = parseFloat(valor3);
			var calculo = valor1 - valor2 - valor3;
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});

			return oNumberFormat.format(calculo);
		},
		convertirDecimal: function (valor) {

			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});

			return oNumberFormat.format(valor);
		},
		formatStatusItemFac: function (est) {
			if (est !== "" && est !== null && est !== undefined) {
				if (est === "Sin Asignar") {
					return "Information";
				} else if (est === "Falta Asignar") {
					return "Warning";
				} else if (est === "Sobre-Asignado") {
					return "Error";
				} else {
					return "Success";
				}
			} else {
				return "None";
			}
		},
		btnBuscarItem: function (oEvent) {
			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var myParam = oThis.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");
			// Obtener el ID principal de lo seleccionado
			var objetoItem = oContext.getObject();
			var valObject = oContext.getPath();
			this.posFacturaGlobal = valObject;
			var pathFacturaItem = valObject;
			var vector = [];
			var llaveSeleccionada = {};
			llaveSeleccionada.POS = oModel.getProperty(valObject + "/clistItemDetalleFacturaPosicion");
			llaveSeleccionada.COD = oModel.getProperty(valObject + "/clistItemDetalleFacturaCodigo");
			llaveSeleccionada.MATERIAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaDescripcion");
			llaveSeleccionada.NETO = oModel.getProperty(valObject + "/clistItemDetalleFacturaValortotalNetoXItem");
			llaveSeleccionada.ORDEN_COMPRA = oModel.getProperty(valObject + "/clistItemsOrdenCompra");
			llaveSeleccionada.TOTAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaTotal");
			var total = 0;
			for (var i = 0; i < llaveSeleccionada.ORDEN_COMPRA.length; i++) {
				total += parseFloat(llaveSeleccionada.ORDEN_COMPRA[i].aIngresar.toString());
			}
			total = total.toFixed(2);
			vector.push(llaveSeleccionada);
			myParam.setProperty("/facturaSeleccionada", vector);

			var listItemDetalleFactura = oModel.getProperty("/listItemDetalleFactura");
			var listItemSeleccionado = oModel.getProperty("/listItemSeleccionado");

			for (var l = 0; l < listItemSeleccionado.length; l++) {
				listItemSeleccionado[l].aIngresar = "0";
				listItemSeleccionado[l].descuento2 = "0";
			}
			var variableList = listItemSeleccionado;
			oModel.setProperty("/listItemSeleccionado", variableList);

			for (var o = 0; o < listItemDetalleFactura.length; o++) {

				if (listItemDetalleFactura[o].clistItemDetalleFacturaPosicion.toString() !== objetoItem.clistItemDetalleFacturaPosicion.toString()) {
					var posicion = listItemDetalleFactura[o];
					for (var p = 0; p < posicion.clistItemsOrdenCompra.length; p++) {
						for (var q = 0; q < listItemSeleccionado.length; q++) {
							if (listItemSeleccionado[q].pos === posicion.clistItemsOrdenCompra[p].pos) {
								var valorDesc1 = listItemSeleccionado[q].descuento2;
								valorDesc1 = parseFloat(valorDesc1.toString());
								var valorDesc2 = posicion.clistItemsOrdenCompra[p].aIngresar;
								valorDesc2 = parseFloat(valorDesc2.toString());
								var calculo = valorDesc1 + valorDesc2;
								listItemSeleccionado[q].descuento2 = calculo.toFixed(2);
							}
						}
					}
				} else {
					var posicion = listItemDetalleFactura[o];
					for (var p = 0; p < posicion.clistItemsOrdenCompra.length; p++) {
						for (var q = 0; q < listItemSeleccionado.length; q++) {
							if (listItemSeleccionado[q].pos === posicion.clistItemsOrdenCompra[p].pos) {
								listItemSeleccionado[q].aIngresar = posicion.clistItemsOrdenCompra[p].aIngresar;
							}
						}
					}
				}

			}
			oModel.setProperty("/listItemSeleccionado", listItemSeleccionado);

			var oTable = new sap.ui.table.Table({
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				width: "30.3rem",
				rows: "{/facturaSeleccionada}"
			});
			oTable.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Posición"
				}),
				template: new sap.m.Text({
					text: "{POS}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Código"
				}),
				template: new sap.m.Text({
					text: "{COD}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Valor Neto"
				}),
				template: new sap.m.Text({
					text: "{NETO}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "12rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Descripción del material"
				}),
				template: new sap.m.Text({
					text: "{MATERIAL}"
				})
			}));
			oTable.setModel(myParam);

			var oTableItem = new sap.ui.table.Table({
				visibleRowCount: 5,
				alternateRowColors: true,
				selectionMode: "None",
				width: "41.3rem",
				rows: "{" + valObject + "/clistItemsOrdenCompra}",
				noData: [
					new sap.m.Text({
						text: "Sin items de orden de compra asignadas."
					})
				]
			});
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Left",
				label: new sap.m.Text({
					text: "Número de Orden"
				}),
				template: new sap.m.Text({
					text: "{ordenCompra}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Left",
				label: new sap.m.Text({
					text: "Posición"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoPosicion}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "9rem",
				hAlign: "Left",
				label: new sap.m.Text({
					text: "Material"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoDescripcion}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "6rem",
				hAlign: "Left",
				label: new sap.m.Text({
					text: "Cantidad"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoCantidad}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Left",
				label: new sap.m.Text({
					text: "Moneda"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoMoneda}"
				})
			}));

			oTableItem.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Left",
				label: new sap.m.Text({
					text: "Monto de Pedido"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoValorIngresar}"
				})
			}));
			oTableItem.setModel(myParam);

			var oTableSubTotal = new sap.ui.table.Table({
				id: "idTableTotal",
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				columnHeaderVisible: false,
				width: "60.3rem",
				rows: "{/subTotal}"
			});
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "13rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "6rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Left",
				template: new sap.m.Label({
					text: "Total",
					design: "Bold"
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: "{total}"
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			var subTotal = [];
			var llaveSub = {};
			llaveSub.total = total;
			subTotal.push(llaveSub);
			myParam.setProperty("/subTotal", subTotal);
			oTableSubTotal.setModel(myParam);

			var hbox = new sap.m.HBox({
				justifyContent: "Center",
				width: "100%"
			});
			hbox.addItem(oTable);

			var oTableOCDet = new sap.ui.table.Table({
				id: "idTablaOrdenCompra",
				visibleRowCount: 5,
				alternateRowColors: true,
				selectionMode: "None",
				width: "60.3rem",
				rows: "{/listItemSeleccionado}"
			});
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Posición"
				}),
				template: new sap.m.Text({
					text: "{pos}"
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "13rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Descripción"
				}),
				template: new sap.m.Text({
					text: "{des}"
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "6rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cantidad"
				}),
				template: new sap.m.Text({
					text: "{cantidad}"
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Valor Neto"
				}),
				template: new sap.m.ObjectNumber({
					unit: "{moneda}",
					textAlign: "Center"
				}).bindProperty("number", "valorNeto", function (bValue) {
					var valor = this.convertirDecimal(bValue);
					return valor;
				}.bind(this))
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Disponible a facturar"
				}),
				template: new sap.m.ObjectNumber({
					unit: "{moneda}",
					textAlign: "Center"
				}).bindProperty("number", {
					parts: [{
						path: 'valorNeto'
					}, {
						path: 'descuento'
					}, {
						path: 'descuento2'
					}],
					formatter: function (valor1, valor2, valor3) {
						var valor = this.formatoCalculoDisponible(valor1, valor2, valor3);
						return valor;
					}.bind(this)
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",

				label: new sap.m.Text({
					text: "A Ingresar"
				}),
				template: new sap.m.Input({
					value: "{aIngresar}",
					editable: true,
					liveChange: function (evt) {
						var valor1 = evt.getSource().getValue();
						var valor1Verdad = valor1;
						var valorF = evt.getSource().getBindingContext().getObject().aIngresar;
						var valor2 = evt.getSource().getBindingContext().getObject().valorNeto;
						var descuento1 = evt.getSource().getBindingContext().getObject().descuento;
						var descuento2 = evt.getSource().getBindingContext().getObject().descuento2;
						valor1 = parseFloat(valor1.toString());
						valor2 = parseFloat(valor2.toString());
						descuento1 = parseFloat(descuento1.toString());
						descuento2 = parseFloat(descuento2.toString());
						var calculo = valor2 - descuento1 - descuento2;
						if (valor1 >= 0 && valor1 <= calculo) {
							var valorSplit = valor1Verdad.split(".");
							if (valorSplit.length === 2) {
								if (valorSplit[1].length === 0 || valorSplit[1].length === 1) {
									evt.getSource().setValue(valor1Verdad);
								} else if (valorSplit[1].length >= 2) {
									valor1Verdad = parseFloat(valor1Verdad.toString()).toFixed(2);
									evt.getSource().setValue(valor1Verdad);
								}
							}
							evt.getSource().getBindingContext().getObject().aIngresar = valor1Verdad;
							// var objeto = evt.getSource().getBindingContext().getObject();
							// if (objeto.selectItem) {
							// 	var clistItemsOrdenCompra = myParam.getProperty(pathFacturaItem + "/clistItemsOrdenCompra");
							// 	for (var i = 0; i < clistItemsOrdenCompra.length; i++) {
							// 		if (this.ordenCompraGlobal === clistItemsOrdenCompra[i].ordenCompra && clistItemsOrdenCompra[i].clistItemFiltroEnProcesoPosicion ===
							// 			objeto.clistItemFiltroEnProcesoPosicion) {
							// 			var valorNuevo = parseFloat(evt.getSource().getValue().toString());
							// 			clistItemsOrdenCompra[i].clistItemFiltroEnProcesoValorIngresar = valorNuevo;
							// 			this.subTotalOrdenCompra(clistItemsOrdenCompra);
							// 			sap.m.MessageToast.show("Se actualizó Valor Neto.");
							// 			return;
							// 		}
							// 	}
							// }

							// return;
						} else {
							var valorIngresar = evt.getSource().getValue();
							if (valorIngresar !== null && valorIngresar !== undefined && valorIngresar !== "") {
								if (valor1 < 0) {
									sap.m.MessageToast.show("No se permiten valores negativos.");
								} else {
									sap.m.MessageToast.show("Valor superior al valor neto.");
								}
								evt.getSource().setValue(valorF.toString());
							} else {
								// evt.getSource().getBindingContext().getObject().aIngresar = "";
								evt.getSource().setValue("");
							}

						}

						var listItemSeleccionado = myParam.getProperty("/listItemSeleccionado");
						var calculoTotal = 0;
						for (var l = 0; l < listItemSeleccionado.length; l++) {
							var valorIngreso = listItemSeleccionado[l].aIngresar;
							if (valorIngreso === null || valorIngreso === undefined || valorIngreso === "") {
								valorIngreso = "0";
							}
							calculoTotal += parseFloat(valorIngreso.toString());
						}
						var subTotal = [];
						var llaveSub = {};
						llaveSub.total = calculoTotal.toFixed(3);
						subTotal.push(llaveSub);
						myParam.setProperty("/subTotal", subTotal);
					}.bind(this),
					type: "Number",
					textAlign: "Center",
					width: "100%"
				})

			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Precio"
				}),
				template: new sap.m.ObjectNumber({
					unit: "{moneda}",
					textAlign: "Center"
				}).bindProperty("number", "precio", function (bValue) {
					var valor = this.convertirDecimal(bValue);
					return valor;
				}.bind(this))
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Estado"
				}),
				template: new sap.m.ObjectStatus({
					text: {
						path: "estado",
						formatter: function (estado) {
							var texto = this.formatAvailableToObjectText(estado);
							return texto;
						}.bind(this)
					},
					state: {
						path: "estado",
						formatter: function (estado) {
							var estado2 = this.formatAvailableToObjectState(estado);
							return estado2;
						}.bind(this)
					}
				})
			}));
			oTableOCDet.setModel(myParam);
			var listConsultaResumenOrden = myParam.getProperty("/listConsultaResumenOrden");
			var oDialogSelectItems = new sap.m.Dialog("idDialogSelectItems", {

				title: "Ordenes de Compra",

				contentWidth: "auto",
				resizable: true,
				draggable: true,
				type: "Message",
				content: [new sap.ui.layout.VerticalLayout({
						id: "idDetalleOC",
						width: "100%",
						content: [
							hbox,
							new sap.m.ObjectHeader({
								id: "idObjectListOC",
								icon: "sap-icon://create",
								attributes: [
									new sap.m.ObjectAttribute({
										id: "idFechaAtributo",
										title: "Fecha"
									}),
									new sap.m.ObjectAttribute({
										id: "idCompraIGV",
										title: "IGV"
									})
								],
								statuses: [
									new sap.m.ObjectStatus({
										id: "idEstadoOC",
										title: "Estado de la O/C",
										state: "None"
									}), new sap.m.ObjectStatus({
										id: "idSituacionOC",
										title: "Situación de la O/C",
										state: "None"
									})
								]
							}),
							oTableOCDet,
							oTableSubTotal
						]
					})

				],
				beginButton: new sap.m.Button({
					text: 'Aceptar',
					type: 'Emphasized',
					icon: 'sap-icon://accept',
					press: function () {
						var listItemSeleccionado = myParam.getProperty("/listItemSeleccionado");
						var llave = {};
						var vector = [];
						for (var l = 0; l < listItemSeleccionado.length; l++) {
							llave = {};
							llave.pos = listItemSeleccionado[l].pos;
								var valorIngreso = listItemSeleccionado[l].aIngresar;
							if (valorIngreso === null || valorIngreso === undefined || valorIngreso === "") {
								valorIngreso = "0";
							}
							llave.aIngresar = valorIngreso;

							llave.cantidad = listItemSeleccionado[l].cantidad;
							llave.des = listItemSeleccionado[l].des;
							llave.estado = listItemSeleccionado[l].estado;

							llave.valorNeto = listItemSeleccionado[l].valorNeto;
							llave.moneda = listItemSeleccionado[l].moneda;
							llave.precio = listItemSeleccionado[l].precio;
							vector.push(llave);
						}
						this.subTotalOrdenCompra(vector);
						oModel.setProperty(valObject + "/clistItemsOrdenCompra", vector);
						oDialogSelectItems.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					type: 'Emphasized',
					icon: 'sap-icon://decline',
					press: function () {
						oDialogSelectItems.close();
					}.bind(this)
				}),
				afterClose: function () {
					oDialogSelectItems.destroy();
				},
				afterOpen: function () {
					oTable.getBinding("rows").refresh(true);

					sap.ui.getCore().byId("idObjectListOC").setTitle("O/C Seleccionado: " + listConsultaResumenOrden.rOrdenCompra);
					var numero = parseFloat(listConsultaResumenOrden.rImporte.toString()).toFixed(2);
					sap.ui.getCore().byId("idObjectListOC").setNumber(numero);
					sap.ui.getCore().byId("idObjectListOC").setNumberUnit(listConsultaResumenOrden.rMoneda);
					sap.ui.getCore().byId("idFechaAtributo").setText(listConsultaResumenOrden.rFecha);
					sap.ui.getCore().byId("idCompraIGV").setText(listConsultaResumenOrden.rIGV);

					sap.ui.getCore().byId("idEstadoOC").setText(listConsultaResumenOrden.rEstado);
					sap.ui.getCore().byId("idSituacionOC").setText(listConsultaResumenOrden.rSituacion);
					sap.ui.getCore().byId("idObjectListOC").addStyleClass("miCabecera");
				}.bind(this)
			});
			oDialogSelectItems.setModel(myParam);
			oDialogSelectItems.open();
			//	this.getView().addStyleClass("sapUiSizeCompact");
			oDialogSelectItems.addStyleClass("sapUiSizeCompact");
		},
		btnAnadirCargarXMLTabla: function (e) {
			this.getView().setBusy(true);
			var oModel = this.getView().getModel("myParam");
			var file = sap.ui.getCore()._file;

			var varNameXML = this.getView().byId("idXML").getValue();
			oModel.setProperty("/listErrores", []);
			var varMatrizError = oModel.getProperty("/listErrores");
			var llaveError = {};

			var view = this.getView();
			var inputs = [
				view.byId("idXML")
			];

			jQuery.each(inputs, function (i, input) {
				if (!input.getValue()) {
					input.setValueState("Error");
					input.setValueStateText("Campo Requerido");
				} else {
					input.setValueState("None");
				}
			});

			var afirmacion = true;
			jQuery.each(inputs, function (i, input) {
				if ("Error" === input.getValueState()) {
					afirmacion = false;
					return false;
				}
			});

			if (afirmacion) {

				if (file && window.FileReader) {
					var fechaUsu = new Date();
					var dia = fechaUsu.getDate();
					var mes = fechaUsu.getMonth() + 1;
					var minutos = fechaUsu.getMinutes();
					var segundos = fechaUsu.getSeconds();
					dia = dia.toString();
					mes = mes.toString();
					minutos = minutos.toString();
					segundos = segundos.toString();
					if (dia.length === 1) {
						dia = "0" + dia;
					}
					if (mes.length === 1) {
						mes = "0" + mes;
					}
					if (minutos.length === 1) {
						minutos = "0" + minutos;
					}
					if (segundos.length === 1) {
						segundos = "0" + segundos;
					}
					var dateUsu = fechaUsu.getFullYear() + '/' + mes + '/' + dia;
					var timeUsu = fechaUsu.getHours() + ":" + minutos + ":" + segundos;

					var oFileUploader = this.getView().byId("idXML");

					var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
					var objeto = {};
					objeto.file = file;
					var calculo = file.size / 1024;
					calculo = calculo.toFixed(2);
					var fecha = file.lastModifiedDate;
					var diaFile = fecha.getDate();
					var mesFile = fecha.getMonth() + 1;
					var minutosFile = fecha.getMinutes();
					var segundosFile = fecha.getSeconds();
					diaFile = diaFile.toString();
					mesFile = mesFile.toString();
					minutosFile = minutosFile.toString();
					segundosFile = segundosFile.toString();
					if (diaFile.length === 1) {
						diaFile = "0" + diaFile;
					}
					if (mesFile.length === 1) {
						mesFile = "0" + mesFile;
					}
					if (minutosFile.length === 1) {
						minutosFile = "0" + minutosFile;
					}
					if (segundosFile.length === 1) {
						segundosFile = "0" + segundosFile;
					}
					var date = fecha.getFullYear() + '/' + mesFile + '/' + diaFile;
					var time = fecha.getHours() + ":" + minutosFile + ":" + segundosFile;

					objeto.fecha = date;
					objeto.hora = time;
					objeto.fechaUsu = dateUsu;
					objeto.horaUsu = timeUsu;
					objeto.tamano = calculo;
					objeto.nombreUsu = file.name;
					objeto.estado = "Cargado";
					oModel.setProperty("/documentoXML", objeto);

					var reader = new FileReader();
					reader.onload = function (evn) {

						var strCSV = evn.target.result; //string in CSV 
						var oModel2 = new sap.ui.model.xml.XMLModel();
						oModel2.setXML(strCSV);
						var sunatUsuario = oModel.getProperty("/sunatUsuario");
						var sunatContrasena = oModel.getProperty("/sunatContrasena");
						oModel.setProperty("/listItemCabeceraFactura", []);
						oModel.setProperty("/listItemDetalleFactura", []);
						var vectorCabeceraFactura = oModel.getProperty("/listItemCabeceraFactura");
						var vectorDetalleFactura = oModel.getProperty("/listItemDetalleFactura");

						// Cabecera de la Factura
						var varVersionUBL = oModel2.getProperty("/cbc:UBLVersionID");
						var varNumFactura = oModel2.getProperty("/cbc:ID");
						var varFecEmision = oModel2.getProperty("/cbc:IssueDate");
						var varEmiRazonSocial = oModel2.getProperty("/cac:Signature/cac:SignatoryParty/cac:PartyName/cbc:Name");
						var varNomComercial = oModel2.getProperty("/cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name");
						var varRUCEmisor = oModel2.getProperty("/cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/CompanyID");
						var varCodTipoDoc = oModel2.getProperty("/cbc:InvoiceTypeCode");
						var varRUCReceptor = oModel2.getProperty("/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/CompanyID");
						var varRecRazonSocial = oModel2.getProperty("/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cbc:RegistrationName");
						var varMoneda = oModel2.getProperty("/cbc:DocumentCurrencyCode");
						var varIGV = "18%";

						var llaveCabeceraFacLabel = [];
						llaveCabeceraFacLabel[0] = "Versión del UBL";
						//		llaveCabeceraFacLabel[1] = "Numeración de la Factura";
						llaveCabeceraFacLabel[1] = "Fecha de Emisión";
						llaveCabeceraFacLabel[2] = "Nombres o Denominación o Razón Social";
						llaveCabeceraFacLabel[3] = "Nombre Comercial";
						llaveCabeceraFacLabel[4] = "Número de RUC";
						llaveCabeceraFacLabel[5] = "Tipo de documento";
						llaveCabeceraFacLabel[6] = "Número de RUC del adquirente o usuario";
						llaveCabeceraFacLabel[7] = "Nombres o Denominación o Razón Social del adquirente o usuario";
						llaveCabeceraFacLabel[8] = "Moneda";
						llaveCabeceraFacLabel[9] = "Tasa de IGV";

						var llaveCabeceraFacValue = [];
						llaveCabeceraFacValue[0] = varVersionUBL;
						//		llaveCabeceraFacValue[1] = varNumFactura;
						llaveCabeceraFacValue[1] = varFecEmision;
						llaveCabeceraFacValue[2] = varEmiRazonSocial;
						llaveCabeceraFacValue[3] = varNomComercial;
						llaveCabeceraFacValue[4] = varRUCEmisor;
						llaveCabeceraFacValue[5] = varCodTipoDoc;
						llaveCabeceraFacValue[6] = varRUCReceptor;
						llaveCabeceraFacValue[7] = varRecRazonSocial;
						llaveCabeceraFacValue[8] = varMoneda;
						llaveCabeceraFacValue[9] = varIGV;

						var llaveCabecera = {};
						for (var i = 0; i < llaveCabeceraFacValue.length; i++) {
							llaveCabecera = {};
							llaveCabecera.label = llaveCabeceraFacLabel[i];
							llaveCabecera.value = llaveCabeceraFacValue[i];
							vectorCabeceraFactura.push(llaveCabecera);
						}
						oModel.setProperty("/pages/0/description", varNumFactura);
						oModel.setProperty("/listItemCabeceraFactura", vectorCabeceraFactura);

						// Detalle de la Factura
						var cont = 1;
						var tamDetalleFactura = 0;
						while (cont === 1) {
							try {
								oModel2.getProperty("/cac:InvoiceLine/" + tamDetalleFactura + "/cbc:ID");
								tamDetalleFactura = tamDetalleFactura + 1;
							} catch (err) {
								cont = 0;
							}
						}

						var varPosicion = [];
						var varCodigo = [];
						var varDescripcion = [];
						var varUnidMedida = [];
						var varCantidad = [];
						var varAfectacionIGV = [];
						var varPrecioUnitxItem = [];
						var varPrecioVentaxItem = [];
						var varTotalIGVxItem = [];
						var varValorVentaxItem = [];
						var varValortotalNetoXItem = [];
						var llaveDetalle = {};
						for (var j = 0; j < tamDetalleFactura; j++) {

							llaveDetalle = {};

							varPosicion[j] = oModel2.getProperty("/cac:InvoiceLine/" + j + "/cbc:ID");
							varCodigo[j] = oModel2.getProperty("/cac:InvoiceLine/" + j + "/cac:Item/cac:SellersItemIdentification/cbc:ID");
							varDescripcion[j] = oModel2.getProperty("/cac:InvoiceLine/" + j + "/cac:Item/cbc:Description");
							varUnidMedida[j] = oModel2.getProperty("/cac:InvoiceLine/" + j + "/cbc:InvoicedQuantity/@unitCode");
							varCantidad[j] = oModel2.getProperty("/cac:InvoiceLine/" + j + "/cbc:InvoicedQuantity");
							varAfectacionIGV[j] = oModel2.getProperty("/cac:InvoiceLine/" + j +
								"/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:Name");
							varPrecioUnitxItem[j] = oModel2.getProperty("/cac:InvoiceLine/" + j + "/cac:Price/cbc:PriceAmount");
							varPrecioVentaxItem[j] = oModel2.getProperty("/cac:InvoiceLine/" + j +
								"/cac:PricingReference/cac:AlternativeConditionPrice/cbc:PriceAmount");
							varTotalIGVxItem[j] = oModel2.getProperty("/cac:InvoiceLine/" + j + "/cac:TaxTotal/cbc:TaxAmount");
							varValorVentaxItem[j] = oModel2.getProperty("/cac:InvoiceLine/" + j + "/cbc:LineExtensionAmount");
							varValortotalNetoXItem[j] = parseFloat(varTotalIGVxItem[j], 10) + parseFloat(varValorVentaxItem[j], 10);
							llaveDetalle.clistItemDetalleFacturaPosicion = varPosicion[j];
							llaveDetalle.clistItemDetalleFacturaEstado = "Sin Asignar";
							llaveDetalle.clistItemDetalleFacturaCodigo = varCodigo[j];
							llaveDetalle.clistItemDetalleFacturaDescripcion = varDescripcion[j];
							llaveDetalle.clistItemDetalleFacturaUniMedida = varUnidMedida[j];
							llaveDetalle.clistItemDetalleFacturaCantidad = varCantidad[j];
							llaveDetalle.clistItemDetalleFacturaAfectacionIGV = varAfectacionIGV[j];
							llaveDetalle.clistItemDetalleFacturaPreUnixItem = varPrecioUnitxItem[j];
							llaveDetalle.clistItemDetalleFacturaPreVenxItem = varPrecioVentaxItem[j];
							llaveDetalle.clistItemDetalleFacturaTotIGVxItem = varTotalIGVxItem[j];
							llaveDetalle.clistItemDetalleFacturaValorVenxItem = varValorVentaxItem[j];
							llaveDetalle.clistItemDetalleFacturaTotal = "0";
							llaveDetalle.clistItemDetalleFacturaValortotalNetoXItem = varValortotalNetoXItem[j].toFixed(2);
							llaveDetalle.clistItemsOrdenCompra = [];

							vectorDetalleFactura.push(llaveDetalle);
						}

						oModel.setProperty("/listItemDetalleFactura", vectorDetalleFactura);

						// Resultados del Detalle de la Factura
						var varTotalDescuentos = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount");
						var varTotalIGV = oModel2.getProperty("/cac:TaxTotal/cbc:TaxAmount");
						var varImporteTotal = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:PayableAmount");

						this.getView().byId("idTotalDescuentos").setValue("     " + varTotalDescuentos);
						this.getView().byId("idTotalIGV").setValue("     " + varTotalIGV);
						this.getView().byId("idImporteTotal").setValue("     " + varImporteTotal);

						// Validar la Factura con la Orden de Compra

						var varOpcion = oModel.getProperty("/listOpcion/rOpcion");

						var variPosicion = [];
						var variDescripcion = [];
						var variPrecioVentaxItem = [];
						var variCantAFacturar = [];
						for (var k = 0; k < tamDetalleFactura; k++) {
							variPosicion[k] = oModel2.getProperty("/cac:InvoiceLine/" + k + "/cbc:ID");
							variDescripcion[k] = oModel2.getProperty("/cac:InvoiceLine/" + k + "/cac:Item/cbc:Description");
							variPrecioVentaxItem[k] = oModel2.getProperty("/cac:InvoiceLine/" + k +
								"/cac:PricingReference/cac:AlternativeConditionPrice/cbc:PriceAmount");
							variCantAFacturar[k] = oModel2.getProperty("/cac:InvoiceLine/" + k + "/cbc:InvoicedQuantity");
						}

						if (varOpcion === "E") {

							var varTamanoE = oModel.getProperty("/listSelectDetalleFacturaEntregado").length;

							var varEfPosicion = [];
							var varEfDescripcion = [];
							var varEfPrecioUnitarioxItem = [];
							var varEfCantAFacturar = [];
							for (i = 0; i < varTamanoE; i++) {
								varEfPosicion[i] = oModel.getProperty("/listSelectDetalleFacturaEntregado/" + i +
									"/clistSelectDetalleFacturaEntregadoPosicion");
								varEfDescripcion[i] = oModel.getProperty("/listSelectDetalleFacturaEntregado/" + i +
									"/clistSelectDetalleFacturaEntregadoDescripcion");
								varEfPrecioUnitarioxItem[i] = oModel.getProperty("/listSelectDetalleFacturaEntregado/" + i +
									"/clistSelectDetalleFacturaEntregadoPrecio");
								varEfCantAFacturar[i] = oModel.getProperty("/listSelectDetalleFacturaEntregado/" + i +
									"/clistSelectDetalleFacturaEntregadoCantidadAFacturar");
							}

							var varcontE = 0;
							var varcontError = 0;
							for (i = 0; i < tamDetalleFactura; i++) {
								if (variPosicion[i] === varEfPosicion[i] && variDescripcion[i] === varEfDescripcion[i] && parseInt(variPrecioVentaxItem[i],
										10) === parseInt(varEfPrecioUnitarioxItem[i], 10) && variCantAFacturar[i] === varEfCantAFacturar[i]) {
									varcontE = varcontE + 1;
								}
								if (variPosicion[i] === varEfPosicion[i] && variDescripcion[i] !== varEfDescripcion[i]) {
									this.getView().byId("idErrores").setVisible(true);
									llaveError = {};
									llaveError.clistErroresTitulo = "Mensaje de Error: " + (varcontError + 1);
									llaveError.clistErroresSubTitulo = "La Descripción de la Orden de Compra no coincide&con la Factura en la posición " +
										variPosicion[i];
									llaveError.clistErroresTipo = "Error";
									varMatrizError.push(llaveError);
									oModel.setProperty("/listErrores", varMatrizError);
								}
								if (variPosicion[i] === varEfPosicion[i] && parseInt(variPrecioVentaxItem[i], 10) !== parseInt(varEfPrecioUnitarioxItem[i],
										10)) {
									this.getView().byId("idErrores").setVisible(true);
									llaveError = {};
									llaveError.clistErroresTitulo = "Mensaje de Error: " + (varcontError + 1);
									llaveError.clistErroresSubTitulo = "El Precio Venta de la Orden de Compra no coincide con la Factura en la posición " +
										variPosicion[i];
									llaveError.clistErroresTipo = "Error";
									varMatrizError.push(llaveError);
									oModel.setProperty("/listErrores", varMatrizError);
								}
								if (variPosicion[i] === varEfPosicion[i] && variCantAFacturar[i] !== varEfCantAFacturar[i]) {
									this.getView().byId("idErrores").setVisible(true);
									llaveError = {};
									llaveError.clistErroresTitulo = "Mensaje de Error: " + (varcontError + 1);
									llaveError.clistErroresSubTitulo = "La Cantidad a Facturar de la Orden de Compra no coincide con la Factura en la posición " +
										variPosicion[i];
									llaveError.clistErroresTipo = "Error";
									varMatrizError.push(llaveError);
									oModel.setProperty("/listErrores", varMatrizError);
								}
							}

						} else if (varOpcion === "A") {

							var varTamanoA = oModel.getProperty("/listSelectDetalleFacturaAceptado").length;

							var varAfPosicion = [];
							var varAfDescripcion = [];
							var varAfPrecioUnitarioxItem = [];
							var varAfCantAFacturar = [];
							for (i = 0; i < varTamanoA; i++) {
								varAfPosicion[i] = oModel.getProperty("/listSelectDetalleFacturaAceptado/" + i +
									"/clistSelectDetalleFacturaAceptadoPosicion");
								varAfDescripcion[i] = oModel.getProperty("/listSelectDetalleFacturaAceptado/" + i +
									"/clistSelectDetalleFacturaAceptadoDescripcion");
								varAfPrecioUnitarioxItem[i] = oModel.getProperty("/listSelectDetalleFacturaAceptado/" + i +
									"/clistSelectDetalleFacturaAceptadoPrecio");
								varAfCantAFacturar[i] = oModel.getProperty("/listSelectDetalleFacturaAceptado/" + i +
									"/clistSelectDetalleFacturaAceptadoCantidadAFacturar");
							}

							var varcontA = 0;
							for (i = 0; i < tamDetalleFactura; i++) {
								if (variPosicion[i] === varAfPosicion[i] && variDescripcion[i] === varAfDescripcion[i] && parseInt(variPrecioVentaxItem[i],
										10) === parseInt(varAfPrecioUnitarioxItem[i], 10) && variCantAFacturar[i] === varAfCantAFacturar[i]) {
									varcontA = varcontA + 1;
								}
								if (variPosicion[i] === varAfPosicion[i] && variDescripcion[i] !== varAfDescripcion[i]) {
									this.getView().byId("idErrores").setVisible(true);
									llaveError = {};
									llaveError.clistErroresTitulo = "Mensaje de Error: " + (varcontError + 1);
									llaveError.clistErroresSubTitulo = "La Descripción de la Orden de Compra no coincide con la Factura en la posición " +
										variPosicion[i];
									llaveError.clistErroresTipo = "Error";
									varMatrizError.push(llaveError);
									oModel.setProperty("/listErrores", varMatrizError);
								}
								if (variPosicion[i] === varAfPosicion[i] && parseInt(variPrecioVentaxItem[i], 10) !== parseInt(varAfPrecioUnitarioxItem[i],
										10)) {
									this.getView().byId("idErrores").setVisible(true);
									llaveError = {};
									llaveError.clistErroresTitulo = "Mensaje de Error: " + (varcontError + 1);
									llaveError.clistErroresSubTitulo = "El Precio Venta de la Orden de Compra no coincide con la Factura en la posición " +
										variPosicion[i];
									llaveError.clistErroresTipo = "Error";
									varMatrizError.push(llaveError);
									oModel.setProperty("/listErrores", varMatrizError);
								}
								if (variPosicion[i] === varAfPosicion[i] && variCantAFacturar[i] !== varAfCantAFacturar[i]) {
									this.getView().byId("idErrores").setVisible(true);
									llaveError = {};
									llaveError.clistErroresTitulo = "Mensaje de Error: " + (varcontError + 1);
									llaveError.clistErroresSubTitulo = "La Cantidad a Facturar de la Orden de Compra no coincide con la Factura en la posición " +
										variPosicion[i];
									llaveError.clistErroresTipo = "Error";
									varMatrizError.push(llaveError);
									oModel.setProperty("/listErrores", varMatrizError);
								}
							}

						}
						sap.m.MessageToast.show("Se realizó la carga XML.");
						this.validarSunat();
						this.verificarAsignaciónPosFactura();
					}.bind(this);
					reader.readAsText(file);
				}
				this.getView().setBusy(false);
			} else {
				var dialog = new sap.m.Dialog({
					title: "Alerta",
					type: "Message",
					state: "Warning",
					content: new sap.m.Text({
						text: "Se requiere seleccionar alguna Factura."

					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: function () {
							dialog.close();
							dialog.destroy();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				this.getView().setBusy(false);
				dialog.open();
			}
		},
		validarSunat: function () {
			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");
			var importe = parseFloat(this.getView().byId("idImporteTotal").getValue().trim()).toFixed(2);
			var ruc = oModel.getProperty("/listItemCabeceraFactura/4/value").trim();
			var tipoDoc = oModel.getProperty("/listItemCabeceraFactura/5/value").trim();
			var fecEmision = oModel.getProperty("/listItemCabeceraFactura/1/value").trim();
			fecEmision = fecEmision.split("-");
			var dia = fecEmision[2];
			var mes = fecEmision[1];
			var ano = fecEmision[0];
			fecEmision = dia + "/" + mes + "/" + ano;
			var description = oModel.getProperty("/pages/0/description");
			description = description.split("-");
			var parte1 = description[0];
			var parte2 = description[1];

			var dato = {
				"numRuc": ruc,
				"codComp": tipoDoc,
				"numeroSerie": parte1,
				"numero": parte2,
				"fechaEmision": fecEmision,
				"monto": importe
			};
			dato = JSON.stringify(dato);

			$.ajax({
				type: "POST",
				data: $.param({
					"grant_type": "client_credentials",
					"scope": "https://api.sunat.gob.pe/v1/contribuyente/contribuyentes",
					"client_id": "3f23ae54-c505-4e7c-9835-53c2e5033226",
					"client_secret": "0Z1p70nZuIKUrmMh9zEb3g=="
				}),
				contentType: "application/x-www-form-urlencoded",
				url: "/valToken/v1/clientesextranet/3f23ae54-c505-4e7c-9835-53c2e5033226/oauth2/token/",
				dataType: "json",
				success: function (data, textStatus, jqXHR) {

					$.ajax({
						url: "/valSunat/v1/contribuyente/contribuyentes/" + ruc + "/validarcomprobante",
						type: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + data.access_token
						},
						data: dato,
						contentType: "application/json",
						success: function (data, message, success) {

							var varCampoEstadoCp = "Estado del comprobante a la fecha de la consulta       :     ";
							var varCampoEstadoRuc = "Estado del contribuyente a la fecha de emisión         :     ";
							var varCampoCondDomiRuc = "Condición de domicilio a la fecha de emisión           :     ";

							// Numero de Registros para la tabla Añadir
							var vector = [];
							var resultado = {};

							switch (data.data.estadoCp) {
							case "0":
								resultado.clistResultadosDato = varCampoEstadoCp + "NO EXISTE";
								this.getView().byId("idValidacionFacySunat1").setText("Estado del comprobante a la fecha de la consulta : NO EXISTE.");
								this.getView().byId("idValidacionFacySunat1").setType("Warning");
								break;
							case "1":
								resultado.clistResultadosDato = varCampoEstadoCp + "ACEPTADO";
								this.getView().byId("idValidacionFacySunat1").setText("Estado del comprobante a la fecha de la consulta : ACEPTADO.");
								this.getView().byId("idValidacionFacySunat1").setType("Success");
								break;
							case "2":
								resultado.clistResultadosDato = varCampoEstadoCp + "ANULADO”";
								this.getView().byId("idValidacionFacySunat1").setText("Estado del comprobante a la fecha de la consulta : ANULADO.");
								this.getView().byId("idValidacionFacySunat1").setType("Error");
								break;
							case "3":
								resultado.clistResultadosDato = varCampoEstadoCp + "AUTORIZADO";
								this.getView().byId("idValidacionFacySunat1").setText("Estado del comprobante a la fecha de la consulta : AUTORIZADO.");
								this.getView().byId("idValidacionFacySunat1").setType("Success");
								break;
							case "4":
								resultado.clistResultadosDato = varCampoEstadoCp + "NO AUTORIZADO";
								this.getView().byId("idValidacionFacySunat1").setText(
									"Estado del comprobante a la fecha de la consulta : NO AUTORIZADO.");
								this.getView().byId("idValidacionFacySunat1").setType("Error");
								break;
							default:
								resultado.clistResultadosDato = varCampoEstadoCp + "-";
								this.getView().byId("idValidacionFacySunat1").setText("Estado del comprobante a la fecha de la consulta : -.");
								this.getView().byId("idValidacionFacySunat1").setType("Error");
								break;
							}
							vector.push(resultado);

							resultado = {};
							switch (data.data.estadoRuc) {
							case "00":
								resultado.clistResultadosDato = varCampoEstadoRuc + "ACTIVO";
								this.getView().byId("idValidacionFacySunat2").setText("Estado del contribuyente a la fecha de emisión : ACTIVO.");
								this.getView().byId("idValidacionFacySunat2").setType("Success");
								break;
							case "01":
								resultado.clistResultadosDato = varCampoEstadoRuc + "BAJA PROVISIONAL";
								this.getView().byId("idValidacionFacySunat2").setText(
									"Estado del contribuyente a la fecha de emisión : BAJA PROVISIONAL.");
								this.getView().byId("idValidacionFacySunat2").setType("Warning");
								break;
							case "02":
								resultado.clistResultadosDato = varCampoEstadoRuc + "BAJA PROV. POR OFICIO";
								this.getView().byId("idValidacionFacySunat2").setText(
									"Estado del contribuyente a la fecha de emisión : BAJA PROV. POR OFICIO.");
								this.getView().byId("idValidacionFacySunat2").setType("Warning");
								break;
							case "03":
								resultado.clistResultadosDato = varCampoEstadoRuc + "SUSPENSION TEMPORAL";
								this.getView().byId("idValidacionFacySunat2").setText(
									"Estado del contribuyente a la fecha de emisión : SUSPENSION TEMPORAL.");
								this.getView().byId("idValidacionFacySunat2").setType("Warning");
								break;
							case "10":
								resultado.clistResultadosDato = varCampoEstadoRuc + "BAJA DEFINITIVA";
								this.getView().byId("idValidacionFacySunat2").setText(
									"Estado del contribuyente a la fecha de emisión : BAJA DEFINITIVA.");
								this.getView().byId("idValidacionFacySunat2").setType("Error");
								break;
							case "11":
								resultado.clistResultadosDato = varCampoEstadoRuc + "BAJA DE OFICIO";
								this.getView().byId("idValidacionFacySunat2").setText("Estado del contribuyente a la fecha de emisión : BAJA DE OFICIO.");
								this.getView().byId("idValidacionFacySunat2").setType("Warning");
								break;
							case "22":
								resultado.clistResultadosDato = varCampoEstadoRuc + "INHABILITADO-VENT.UNICA";
								this.getView().byId("idValidacionFacySunat2").setText(
									"Estado del contribuyente a la fecha de emisión : INHABILITADO-VENT.UNICA.");
								this.getView().byId("idValidacionFacySunat2").setType("Error");
								break;
							default:
								resultado.clistResultadosDato = varCampoEstadoRuc + "-";
								this.getView().byId("idValidacionFacySunat2").setText("Estado del contribuyente a la fecha de emisión : -.");
								this.getView().byId("idValidacionFacySunat2").setType("Error");
								break;
							}
							vector.push(resultado);

							resultado = {};
							switch (data.data.condDomiRuc) {
							case "00":
								resultado.clistResultadosDato = varCampoCondDomiRuc + "HABIDO";
								this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : HABIDO.");
								this.getView().byId("idValidacionFacySunat3").setType("Success");
								break;
							case "09":
								resultado.clistResultadosDato = varCampoCondDomiRuc + "PENDIENTE";
								this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : PENDIENTE.");
								this.getView().byId("idValidacionFacySunat3").setType("Warning");
								break;
							case "11":
								resultado.clistResultadosDato = varCampoCondDomiRuc + "POR VERIFICAR";
								this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : POR VERIFICAR.");
								this.getView().byId("idValidacionFacySunat3").setType("Warning");
								break;
							case "12":
								resultado.clistResultadosDato = varCampoCondDomiRuc + "NO HABIDO";
								this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : NO HABIDO.");
								this.getView().byId("idValidacionFacySunat3").setType("Warning");
								break;
							case "20":
								resultado.clistResultadosDato = varCampoCondDomiRuc + "NO HALLADO";
								this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : NO HABIDO.");
								this.getView().byId("idValidacionFacySunat3").setType("Error");
								break;
							default:
								resultado.clistResultadosDato = varCampoCondDomiRuc + "-";
								this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : -.");
								this.getView().byId("idValidacionFacySunat3").setType("Error");
								break;
							}
							vector.push(resultado);

							oModel.setProperty("/listResultados", vector);
						}.bind(this),
						error: function (e) {
							try {
								this.getView().byId("idValidacionFacySunat1").setText(e + "");
								this.getView().byId("idValidacionFacySunat1").setType("Warning");
							} catch (err) {
								this.getView().byId("idValidacionFacySunat1").setText("Error al validar con la SUNAT para la factura : " + parte1 + "-" +
									parte2 + ".");
								this.getView().byId("idValidacionFacySunat1").setType("Warning");
							}
							this.getView().byId("idValidacionFacySunat2").setText("Estado del contribuyente a la fecha de emisión : ERROR.");
							this.getView().byId("idValidacionFacySunat2").setType("Warning");
							this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : ERROR.");
							this.getView().byId("idValidacionFacySunat3").setType("Warning");
						}.bind(this)
					});
					///////////////////////////////////////////////////////////////////////////////////////////
				}.bind(this),
				error: function (e) {
					try {
						this.getView().byId("idValidacionFacySunat1").setText(e.responseTex + "");
						this.getView().byId("idValidacionFacySunat1").setType("Error");
					} catch (err) {
						this.getView().byId("idValidacionFacySunat1").setText("Error al validar con la SUNAT para la factura : " + parte1 + "-" +
							parte2 + ".");
						this.getView().byId("idValidacionFacySunat1").setType("Error");
					}
					this.getView().byId("idValidacionFacySunat2").setText("Estado del contribuyente a la fecha de emisión : ERROR.");
					this.getView().byId("idValidacionFacySunat2").setType("Error");
					this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : ERROR.");
					this.getView().byId("idValidacionFacySunat3").setType("Error");
					/*	var dialog = new sap.m.Dialog({
							title: 'Error al Consultar',
							type: 'Message',
							state: 'Error',
							content: new sap.m.Text({
								text: e.responseText
							}),
							beginButton: new sap.m.Button({
								text: 'OK',
								press: function () {
									dialog.close();
								}
							}),
							afterClose: function () {
								dialog.destroy();
							}
						});
						dialog.open();*/
				}.bind(this)
			});
		},
		subTotalOrdenCompra: function (contenido) {
			var myParam = this.getView().getModel("myParam");
			var total = 0;
			var valorNeto = myParam.getProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaValortotalNetoXItem");

			for (var i = 0; i < contenido.length; i++) {
				total += parseFloat(contenido[i].aIngresar.toString());
			}
			total = total.toFixed(2);
			myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaTotal", total);
			myParam.setProperty("/facturaSeleccionada/0/TOTAL", total);
			if (contenido.length !== 0) {
				if (parseFloat(valorNeto.toString()) === parseFloat(total.toString())) {
					myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaEstado", "Asignado");
				} else if (parseFloat(valorNeto.toString()) > parseFloat(total.toString())) {
					myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaEstado", "Falta Asignar");
				} else if (parseFloat(valorNeto.toString()) < parseFloat(total.toString())) {
					myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaEstado", "Sobre-Asignado");
				}
			} else {
				myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaEstado", "Sin Asignar");
			}
			var subTotal = [];
			var llaveSub = {};
			llaveSub.total = total;
			subTotal.push(llaveSub);
			myParam.setProperty("/subTotal", subTotal);
			// sap.ui.getCore().byId("idTableTotal").getBinding("rows").refresh(true);
			this.verificarAsignaciónPosFactura();
		},
		verificarAsignaciónPosFactura: function () {
			var myParam = this.getView().getModel("myParam");
			var listaItem = myParam.getProperty("/listItemDetalleFactura");

			var asignado = true;
			for (var i = 0; i < listaItem.length; i++) {
				if (listaItem[i].clistItemDetalleFacturaEstado !== "Asignado") {
					asignado = false;
				}
			}
			if (listaItem.length !== 0) {
				if (asignado) {
					this.getView().byId("idValidacionFacAsig").setText("Todos los items de la factura asignadas.");
					this.getView().byId("idValidacionFacAsig").setType("Success");
					this.getView().byId("idFacturar").setEnabled(true);
				} else {
					this.getView().byId("idValidacionFacAsig").setText("Se requiere asignar todos los items de la factura.");
					this.getView().byId("idValidacionFacAsig").setType("Warning");
					this.getView().byId("idFacturar").setEnabled(false);
				}
			} else {
				this.getView().byId("idValidacionFacAsig").setText("Sin items a asignar.");
				this.getView().byId("idValidacionFacAsig").setType("Information");
				this.getView().byId("idFacturar").setEnabled(false);
			}
		},
		createCORSRequest: function (method, url) {

			var xhr = new XMLHttpRequest();
			if ("withCredentials" in xhr) {
				xhr.open(method, url, false);
			} else if (typeof XDomainRequest != "undefined") {
				xhr = new XDomainRequest();
				xhr.open(method, url);
			} else {
				xhr = null;
			}
			return xhr;
		},
		limpiarDetallePosicion: function () {
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var registroItem = {};
			registroItem.rDescripcion = "--Seleccione posición--";
			registroItem.rPrecio = "00";
			registroItem.rMoneda = "--";
			registroItem.rValorNeto = "---";
			registroItem.rCantidad = "---";
			registroItem.rNumMaterial = "---";
			registroItem.rGuiaRemision = "---";
			registroItem.rDocMaterial = "---";
			registroItem.rFechaRegistro = "---";
			registroItem.rDireccionEntrega = "---";
			registroItem.rEstado = "---";
			oModel.setProperty("/listVizualizarDetFacEntregado", registroItem);
			oModel.setProperty("/listItemCronFacEntregado", []);
		},
		limpiarDetalleAceptado: function () {
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var registroItem = {};

			registroItem.rDescripcion = "--Seleccione posición--";
			registroItem.rValorNeto = "00";
			registroItem.rMoneda = "--";
			registroItem.rCantidad = "---";
			registroItem.rEstado = "---";
			registroItem.rServicio = "---";
			registroItem.rNumAceptacion = "---";
			registroItem.rDocMaterial = "---";
			registroItem.rDireccionEntrega = "---";
			registroItem.rFechaAceptacion = "---";
			registroItem.rPrecio = "---";
			registroItem.rHojaEntrada = "---";
			oModel.setProperty("/listVizualizarDetFacAceptado", registroItem);
			oModel.setProperty("/listItemCronFacAceptado", []);
		},
		btnFilaEntregado: function (oEvent) {
			this.getView().setBusy(true);
			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var items = this.getView().byId("idTableItemEntregado").getSelectedIndices().length;

			if (items === 0) {
				this.limpiarDetallePosicion();
				this.getView().setBusy(false);
			} else {
				var varElement = oEvent.getParameters().rowContext.getPath();
				var vlistItemFiltroEntregadoOrdenCompra = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoOrdenCompra");
				var vlistItemFiltroEntregadoDescripcion = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoDescripcion");
				var vlistItemFiltroEntregadoValorNeto = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoValorNeto");
				var vlistItemFiltroEntregadoMoneda = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoMoneda");
				var vlistItemFiltroEntregadoCantidad = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoCantidad");
				var vlistItemFiltroEntregadoEstado = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoEstado");
				var vlistItemFiltroEntregadoNumMaterial = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoNumMaterial");
				var vlistItemFiltroEntregadoNumDocMaterial = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoNumDocMaterial");
				var vlistItemFiltroEntregadoGuiaRemision = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoGuiaRemision");
				var vlistItemFiltroEntregadoDireccionEntrega = oModel.getProperty(varElement +
					"/clistSelectDetalleFacturaEntregadoDireccionEntrega");
				var vlistItemFiltroEntregadoFechaRegistro = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoFechaRegistro");
				var vlistItemFiltroEntregadoIdCrono = parseInt(oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoIdCrono"), 10);
				var vlistItemFiltroEntregadoPrecio = oModel.getProperty(varElement + "/clistSelectDetalleFacturaEntregadoPrecio");

				// Registros para el Reporte
				var registroItem = {};

				registroItem.rDescripcion = vlistItemFiltroEntregadoDescripcion;
				registroItem.rValorNeto = Intl.NumberFormat("de-DE").format(vlistItemFiltroEntregadoValorNeto);
				registroItem.rMoneda = vlistItemFiltroEntregadoMoneda;
				registroItem.rCantidad = vlistItemFiltroEntregadoCantidad;
				registroItem.rEstado = vlistItemFiltroEntregadoEstado;
				registroItem.rNumMaterial = vlistItemFiltroEntregadoNumMaterial;
				registroItem.rDocMaterial = vlistItemFiltroEntregadoNumDocMaterial;
				registroItem.rGuiaRemision = vlistItemFiltroEntregadoGuiaRemision;
				registroItem.rDireccionEntrega = vlistItemFiltroEntregadoDireccionEntrega;
				registroItem.rFechaRegistro = vlistItemFiltroEntregadoFechaRegistro;
				registroItem.rPrecio = vlistItemFiltroEntregadoPrecio;

				// Insertar el registro en la tabla listVizualizarDetFacEntregado
				oModel.setProperty("/listVizualizarDetFacEntregado", registroItem);

				// Datos en la Tabla de Detalle Cronograma

				//Filtros
				var filters = [];
				var filter1 = new sap.ui.model.Filter("CR_NUM_ORDEN", sap.ui.model.FilterOperator.EQ, vlistItemFiltroEntregadoOrdenCompra);
				filters.push(filter1);
				var filter2 = new sap.ui.model.Filter("CR_NUM_ARTICULO", sap.ui.model.FilterOperator.EQ, vlistItemFiltroEntregadoIdCrono.toString());
				filters.push(filter2);

				// Mostrar JSON
				var url = "/odatabnv/odata2.svc/";
				var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);

				var matrixCronoEntregado = [];
				var registroCronoEntregado = {};
				oModelJson.read("/T_CRONOGRAMA?$format=json", {
					filters: filters,
					success: function (response) {
						try {
							var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

							var tamTabla = oModelJSON.getData().length;

							var contCronoEntregado = 0;
							for (var i = 0; i < tamTabla; i++) {
								registroCronoEntregado = {};
								registroCronoEntregado.clistItemCronogramaEntregadoCantidad = oModelJSON.getData()[i].CR_CANTIDAD;
								registroCronoEntregado.clistItemCronogramaEntregadoFechaEntrega = oModelJSON.getData()[i].CR_FEC_ENTREGA;
								registroCronoEntregado.clistItemCronogramaEntregadoFechaEstimada = oModelJSON.getData()[i].CR_FEC_ESTIMADA;
								registroCronoEntregado.clistItemCronogramaEntregadoEstado = oModelJSON.getData()[i].CR_SITUACION1;
								matrixCronoEntregado.push(registroCronoEntregado);
								contCronoEntregado++;
							}

							oModel.setProperty("/listItemCronFacEntregado", matrixCronoEntregado);
							oThis.getView().byId("idTableItemCronogramaEntregado").getBinding("rows").refresh(true);
							this.getView().setBusy(false);
						} catch (err) {
							this.getView().setBusy(false);
						}

					}.bind(this),

					error: function (oError) {
						this.getView().setBusy(false);
					}.bind(this)
				});
			}
		},
		formatAvailableToObjectState: function (bAvailable) {

			if (bAvailable === "PENDIENTE") {
				return "Error";
			} else if (bAvailable === "ACEPTADO") {
				return "Success";
			} else if (bAvailable === "ENTREGADO") {
				return "Warning";
			} else if (bAvailable === "FACTURADO") {
				return "Information";
			} else if (bAvailable === "Facturado") {
				return "Information";
			} else if (bAvailable === "Pendiente") {
				return "Error";
			} else if (bAvailable === "Entregado") {
				return "Warning";
			} else {
				return "None";
			}

		},
		formatAvailableToObjectText: function (bAvailable) {

			if (bAvailable === "PENDIENTE") {
				return "PENDIENTE";
			} else if (bAvailable === "ACEPTADO") {
				return "FACTURADO";
			} else if (bAvailable === "ENTREGADO") {
				return "ENTREGADO";
			} else if (bAvailable === "FACTURADO") {
				return "FINALIZADO";
			} else {
				return bAvailable;
			}

		},
		documentoValor: function (valor) {

			if (valor !== "" && valor !== null && valor !== undefined) {
				return valor;
			} else {
				return "---";
			}
		},

		fechaValor: function (fecha) {

			if (fecha !== "" && fecha !== null && fecha !== undefined) {
				return fecha;
			} else {
				return "--/--/----";
			}
		},

		horaValor: function (hora) {
			if (hora !== "" && hora !== null && hora !== undefined) {
				return hora;
			} else {
				return "--:--:--";
			}
		},

		documentoAsignado: function (doc) {

			if (doc !== "" && doc !== null && doc !== undefined) {
				return doc;
			} else {
				return "--Sin adjuntar--";
			}
		},

		tipoFormato: function (tipo) {

			if (tipo !== "" && tipo !== null && tipo !== undefined) {
				if (tipo === "Obligatorio") {
					return "Error";
				} else {
					return "Warning";
				}
			} else {
				return "None";
			}
		},

		estadoFormato: function (estado) {

			if (estado !== "" && estado !== null && estado !== undefined) {
				if (estado === "No Cargado") {
					return "Error";
				} else {
					return "Success";
				}
			} else {
				return "None";
			}
		},

		documentoFormato: function (formato) {

			if (formato !== "" && formato !== null && formato !== undefined) {
				if (formato.includes("DOC")) {
					return "sap-icon://doc-attachment";
				} else if (formato.includes("PNG") || formato.includes("PPM") || formato.includes("PGM") || formato.includes("PBM") || formato.includes(
						"PNM") || formato.includes("JP")) {
					return "sap-icon://picture";
				} else if (formato.includes("PDF")) {
					return "sap-icon://pdf-attachment";
				} else if (formato.includes("XLS") || formato.includes("CSV")) {
					return "sap-icon://excel-attachment";
				} else if (formato.includes("XML")) {
					return "sap-icon://document-text";
				} else {
					return "sap-icon://document";
				}
			} else {
				return "sap-icon://document";
			}
		},

		btnErrores: function () {

			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");
			var myParam = this.getView().getModel("myParam");

			var oMessageTemplate = new sap.m.MessageItem({
				type: "{myParam>clistErroresTipo}",
				title: "{myParam>clistErroresTitulo}",
				//subtitle: "{path: 'myParam>clistErroresSubTitulo',formatter: '.formatText'}",
				subtitle: "{myParam>clistErroresSubTitulo}"
			});

			var oMessageView = new sap.m.MessageView({
				showDetailsPageHeader: false,
				items: {
					path: "myParam>/listErrores",
					template: oMessageTemplate
				}
			});

			//oMessageView.setModel(oModel);
			var dialogError = new sap.m.Dialog({
				resizable: true,
				content: oMessageView,
				state: 'Error',
				beginButton: new sap.m.Button({
					press: function () {
						dialogError.close();
					},
					text: "Cerrar"
				}),
				customHeader: new sap.m.Bar({
					contentMiddle: [
						new sap.m.Text({
							text: "Error"
						})
					]
				}),
				afterClose: function () {
					dialogError.destroy();
				},
				contentHeight: "200px",
				contentWidth: "670px",
				verticalScrolling: false
			});

			dialogError.open();

			oMessageView.setModel(myParam, "myParam");
		},
		btnCredenciales: function () {

			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");


			var usuarioGuardado = oModel.getProperty("/sunatUsuario");
			var contrasenaGuardado = oModel.getProperty("/sunatContrasena");

			var varNumFactura = oModel.getProperty("/listItemCabeceraFactura/1/value");
			var varProductstxt = "";
			var vectorProductstxt = [];
			var llaveProductstxt = {};
			for (var k = 0; k < varNumFactura.length; k++) {
				if (varNumFactura.substring(k, k + 1) !== "-") {
					varProductstxt = varProductstxt + varNumFactura.substring(k, k + 1);
				}
				if (varNumFactura.substring(k, k + 1) === "-" || k === varNumFactura.length - 1) {
					llaveProductstxt = {};
					llaveProductstxt.Dato = varProductstxt;
					vectorProductstxt.push(llaveProductstxt);
					varProductstxt = "";
				}
			}

			var varTipoNumComprobante = oModel.getProperty("/listItemCabeceraFactura/5/value");
			var vartamtblListTipoDocumento = oModel.getProperty("/listTipoDocumento").length;

			for (var i = 0; i < vartamtblListTipoDocumento; i++) {
				var varTipo = oModel.getProperty("/listTipoDocumento/" + i + "/clistTipoDocumentoCodigo");
				if (varTipo === varTipoNumComprobante.substr(0, 2)) {
					var varRespuesta = oModel.getProperty("/listTipoDocumento/" + i + "/clistTipoDocumentoDescripcion");
				}
			}
			var varNumFactura = oModel.getProperty("/pages/0/description");
			varNumFactura = varNumFactura.split("-");
			var varSerieComprobante = null;
			var iconoSerieComprobante = "sap-icon://message-information";
			var colorSerieComprobante = "#0982C7";
			if (varNumFactura[0] === "" || varNumFactura[0] === "Sin asignar") {
				varSerieComprobante = "Sin cargar XML";
			} else {
				varSerieComprobante = varNumFactura[0];
				iconoSerieComprobante = "sap-icon://complete";
				colorSerieComprobante = "#29C709";
			}

			var varNumComprobante = null;
			var iconoNumComprobante = "sap-icon://message-information";
			var colorNumComprobante = "#0982C7";
			if (varNumFactura[1] === "" || varNumFactura[1] === "Sin asignar") {
				varNumComprobante = "Sin cargar XML";
			} else {
				varNumComprobante = varNumFactura[1];
				iconoNumComprobante = "sap-icon://complete";
				colorNumComprobante = "#29C709";
			}

			var varRucComprobante = null;
			var iconoRucComprobante = "sap-icon://message-information";
			var colorRucComprobante = "#0982C7";
			if (vectorProductstxt[1].Dato === "") {
				varRucComprobante = "Sin cargar XML";
			} else {
				varRucComprobante = oModel.getProperty("/listItemCabeceraFactura/6/value");
				iconoRucComprobante = "sap-icon://complete";
				colorRucComprobante = "#29C709";
			}

			var varTipoDesComprobante = null;
			var iconoTipoDesComprobante = "sap-icon://message-information";
			var colorTipoDesComprobante = "#0982C7";
			if (vectorProductstxt[1].Dato === "") {
				varTipoDesComprobante = "Sin cargar XML";
			} else {
				varTipoDesComprobante = varRespuesta;
				iconoTipoDesComprobante = "sap-icon://complete";
				colorTipoDesComprobante = "#29C709";
			}

			var oDialog = new sap.m.Dialog("Dialog", {
				resizable: true,
				draggable: true,
				title: "Validación con SUNAT",
				contentWidth: "350px",
				modal: true,
				type: "Message",
				content: [
					new sap.m.Label({
						text: "Credenciales",
						design: "Bold",
						width: "100%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Usuario",
						width: "100%"
					}),
					new sap.m.Input({
						id: "idUsuarioSut",
						value: usuarioGuardado,
						editable: true,
						valueStateText: "Se requiere el ingreso de su usuario SUNAT.",
						maxLength: 20,
						placeholder: "Ingrese usuario (20) ...",
						required: true,
						width: "100%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Contraseña",
						width: "100%"
					}),
					new sap.m.Input({
						id: "idContrasenaSut",
						type: "Password",
						value: contrasenaGuardado,
						editable: true,
						maxLength: 20,
						valueStateText: "Se requiere la contraseña de su usuario SUNAT.",
						placeholder: "Ingrese contraseña (20) ...",
						required: true,
						width: "82%"
					}),
					new sap.m.Label({
						text: "",
						width: "3%"
					}),
					new sap.m.ToggleButton({
						icon: "sap-icon://show",
						press: function (oEvent) {
							var varTipoInput = sap.ui.getCore().byId('idContrasenaSut').getType();
							if (varTipoInput === "Password") {
								sap.ui.getCore().byId('idContrasenaSut').setType("Text");
							} else {
								sap.ui.getCore().byId('idContrasenaSut').setType("Password");
							}
						},
						width: "15%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Datos Factura para Validar",
						design: "Bold",
						width: "100%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Ruc de Comprobante: ",
						width: "60%"
					}),
					new sap.ui.core.Icon({
						src: iconoRucComprobante,
						class: "size1",
						color: colorRucComprobante,
						width: "10%"
					}),
					new sap.m.Label({
						text: varRucComprobante,
						width: "30%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Tipo de Comprobante: ",
						width: "60%"
					}),
					new sap.ui.core.Icon({
						src: iconoTipoDesComprobante,
						class: "size1",
						color: colorTipoDesComprobante,
						width: "10%"
					}),
					new sap.m.Label({
						text: varTipoDesComprobante,
						width: "30%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Serie de Comprobante: ",
						width: "60%"
					}),
					new sap.ui.core.Icon({
						src: iconoSerieComprobante,
						class: "size1",
						color: colorSerieComprobante,
						width: "10%"
					}),
					new sap.m.Label({
						text: varSerieComprobante,
						width: "30%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Número de Comprobante: ",
						width: "60%"
					}),
					new sap.ui.core.Icon({
						src: iconoNumComprobante,
						class: "size1",
						color: colorNumComprobante,
						width: "10%"
					}),
					new sap.m.Label({
						text: varNumComprobante,
						width: "30%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					})
				],
				beginButton: new sap.m.Button("btnVisibleGeneral", {
					icon: "sap-icon://save",
					text: "Guardar",
					visible: true,
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idUsuarioSut"),
							sap.ui.getCore().byId("idContrasenaSut")
						];
						jQuery.each(inputs, function (i, input) {
							if (!input.getValue()) {
								input.setValueState("Error");
								canContinue = false;
							} else {
								input.setValueState("None");
							}
						});
						if (canContinue) {
							var sunatUsuario = sap.ui.getCore().byId("idUsuarioSut").getValue();
							var sunatContrasena = sap.ui.getCore().byId("idContrasenaSut").getValue();
							oModel.setProperty("/sunatUsuario", sunatUsuario);
							oModel.setProperty("/sunatContrasena", sunatContrasena);
							sap.m.MessageToast.show("Se guardaron las credenciales correctamente");
							oDialog.close();
						} else {
							var dialog = new sap.m.Dialog({
								title: "Alerta",
								type: "Message",
								state: "Warning",
								content: new sap.m.Text({
									text: "Se requiere ingresar todas las credenciales."

								}),
								beginButton: new sap.m.Button({
									text: "Aceptar",
									type: "Emphasized",
									press: function () {
										dialog.close();
										dialog.destroy();

									}
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});

							dialog.open();
							oDialog.close();
						}
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					icon: "sap-icon://cancel",
					text: "Cancelar",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});
			oDialog.open();
		},

		formatText: function (sValue) {
			//debugger;
			var sNewString = '';
			var formattedText = '';
			var linkLength = (sValue.match(/&/g) || []).length + 1;
			if (sValue.indexOf('&') != -1) {
				sNewString = '';
				var main = sValue.split('&');
				for (var i = 0; i < main.length; i++) {
					var child = main[i].split('-');
					sNewString += child + '&';
				}
				formattedText = sNewString.replace(/&/g, "\n");
			} else {
				formattedText = sValue;
			}
			return formattedText;
		},
			obtenerExitoOdata: function (titulo, mensaje) {
			var model = this.getView().getModel("myParam");
			var listErrores = model.getProperty("/listErrores");
			var llaveExito = {};

			llaveExito.clistErroresTitulo = titulo;
			llaveExito.clistErroresSubTitulo = mensaje;
			llaveExito.clistErroresTipo = "Success";
			listErrores.push(llaveExito);
			model.setProperty("/listErrores", listErrores);
		},
		obtenerErrorOdata: function (response, titulo2, mensaje2) {
			var model = this.getView().getModel("myParam");
			var listErrores = model.getProperty("/listErrores");
			var llaveError = {};
			try {
				var responseText = response.responseText;
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(responseText, "text/xml");
				var message = xmlDoc.getElementsByTagName("error")[0].textContent;
				llaveError = {};
				llaveError.clistErroresTitulo = "(" + response.statusCode + ") " + response.statusText;
				llaveError.clistErroresSubTitulo = message;
				llaveError.clistErroresTipo = "Error";
				listErrores.push(llaveError);

			} catch (err) {
				llaveError = {};
				llaveError.clistErroresTitulo = titulo2;
				llaveError.clistErroresSubTitulo = mensaje2;
				llaveError.clistErroresTipo = "Error";
				listErrores.push(llaveError);
			}
			model.setProperty("/listErrores", listErrores);
		},
		btnFacturar: function () {
			this.getView().setBusy(true);

			var url = "/odatabnv/odata2.svc/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var filters = [];
			var filter;

			var fecha = new Date();
			var dia = fecha.getDate();
			var mes = fecha.getMonth() + 1;
			var minutos = fecha.getMinutes();
			var segundos = fecha.getSeconds();
			dia = dia.toString();
			mes = mes.toString();
			minutos = minutos.toString();
			segundos = segundos.toString();
			if (dia.length === 1) {
				dia = "0" + dia;
			}
			if (mes.length === 1) {
				mes = "0" + mes;
			}
			if (minutos.length === 1) {
				minutos = "0" + minutos;
			}
			if (segundos.length === 1) {
				segundos = "0" + segundos;
			}
			var date = fecha.getFullYear() + '/' + mes + '/' + dia;
			var time = fecha.getHours() + ":" + minutos + ":" + segundos;

			var totalDesc = this.getView().byId("idTotalDescuentos").getValue();
			var totalIGV = this.getView().byId("idTotalIGV").getValue();
			var totalImp = this.getView().byId("idImporteTotal").getValue();

			var model = this.getView().getModel("myParam");
				var listConsultaResumenOrden = model.getProperty("/listConsultaResumenOrden");
			model.setProperty("/listErrores", []);
			var paginaCard = model.getProperty("/pages/0");
			filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, paginaCard.description);
			filters.push(filter);

			oModel.read("/T_FAC?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					if (lenghtV === 0) {
							var oFileUploader = this.getView().byId("idXML");
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			var fileName = paginaCard.description + ".xml";
			var data = {
				'propertyId[0]': 'cmis:objectTypeId',
				'propertyValue[0]': 'cmis:document',
				'propertyId[1]': 'cmis:name',
				'propertyValue[1]': fileName,
				'cmisaction': 'createDocument'
			};

			var formData = new FormData();
			formData.append('datafile', file);
			jQuery.each(data, function (key, value) {
				formData.append(key, value);
			});
				$.ajax('/DOCUMENT/c4def343310ca504ab4c93d5/root', {
				method: 'POST',
				data: formData,
				cache: false,
				processData: false,
				contentType: false,
				success: function (response) {	
						this.obtenerExitoOdata("Factura " + fileName, "Se guardó con éxito el archivo " + fileName + ".");
				}.bind(this),
				error: function (data) {
						this.obtenerErrorOdata(data, "Error al registrar en el Document Service", "No se pudo guardar el archivo" + fileName +
									".");
				}.bind(this)
			});	
						
						
						var cabecera = model.getProperty("/listItemCabeceraFactura");
						var usuario = model.getProperty("/usuarioLogin");
						var rucUser = model.getProperty("/usuarioRuc");

						var SOHeader = {};
						SOHeader.EM_RUC = rucUser;
						SOHeader.US_RUC = rucUser;
						SOHeader.ID_FACTURA = paginaCard.description;

						SOHeader.UBL = cabecera[0].value.trim();
						SOHeader.FC_FEC_EMISION = cabecera[1].value.trim();
						SOHeader.NOM_DEM_RAZ = cabecera[2].value.trim();
						SOHeader.NOM_COMERCIAL = cabecera[3].value.trim();
						//		SOHeader.RUC = cabecera[4].value.trim();
						SOHeader.TIPO_DOC = cabecera[5].value.trim();
						SOHeader.RUC_ADQ = cabecera[6].value.trim();
						SOHeader.NOM_DEM_RAZ_ADQ = cabecera[7].value.trim();
						SOHeader.MONEDA = cabecera[8].value.trim();
						SOHeader.TASA_IGV = cabecera[9].value.trim();
						SOHeader.TOTAL_DESC = totalDesc.trim();
						SOHeader.TOTAL_IGV = totalIGV.trim();
						SOHeader.TOTAL_IMP = totalImp.trim();

						SOHeader.FC_FEC_REGISTRO = date;
						SOHeader.FC_HORA_REGISTRO = time;
						SOHeader.FC_USER_REGISTRO = usuario;
						oModel.create("/T_FAC", SOHeader, {
							method: "POST",
							success: function (data) {
								this.obtenerExitoOdata("Factura " + data.ID_FACTURA, "Se registró con éxito la factura " + data.ID_FACTURA + ".");
								var listItemDetalleFactura = model.getProperty("/listItemDetalleFactura");
								var llavePos = {};
								var llaveItem = {};
								for (var a = 0; a < listItemDetalleFactura.length; a++) {
									llavePos = {};
									llavePos.EM_RUC = rucUser;
									llavePos.US_RUC = rucUser;
									llavePos.ID_FACTURA = paginaCard.description;
									llavePos.POS_FACTURA = listItemDetalleFactura[a].clistItemDetalleFacturaPosicion;
									llavePos.PRECIO_NETO = listItemDetalleFactura[a].clistItemDetalleFacturaValortotalNetoXItem;
									llavePos.CODIGO = listItemDetalleFactura[a].clistItemDetalleFacturaCodigo;
									llavePos.DESCRIPCION = listItemDetalleFactura[a].clistItemDetalleFacturaDescripcion;
									llavePos.UND_MED = listItemDetalleFactura[a].clistItemDetalleFacturaUniMedida;

									llavePos.CANTIDAD = listItemDetalleFactura[a].clistItemDetalleFacturaCantidad;
									llavePos.PRE_UNI = listItemDetalleFactura[a].clistItemDetalleFacturaPreUnixItem;
									llavePos.PRE_VENTA = listItemDetalleFactura[a].clistItemDetalleFacturaPreVenxItem;
									var itemsOC = listItemDetalleFactura[a].clistItemsOrdenCompra;
									for (var b = 0; b < itemsOC.length; b++) {
										llaveItem = {};
										llaveItem.EM_RUC = rucUser;
										llaveItem.US_RUC = rucUser;
										llaveItem.ID_FACTURA = paginaCard.description;
										llaveItem.POS_FACTURA =  listItemDetalleFactura[a].clistItemDetalleFacturaPosicion;
										llaveItem.OC_NUMERO_ORDEN = listConsultaResumenOrden.rOrdenCompra;
										llaveItem.DE_POSICION = itemsOC[b].pos;
										llaveItem.PRECIO_ING = itemsOC[b].des;
										llaveItem.CODIGO = "";
										llaveItem.DESCRIPCION = itemsOC[b].des;
										llaveItem.UND_MED = itemsOC[b].moneda;
										llaveItem.CANTIDAD = itemsOC[b].cantidad;
										llaveItem.PRE_UNI = "";
										llaveItem.PRE_VENTA = "";
										oModel.create("/T_FAC_POS", llaveItem, {
											method: "POST",
											success: function (data) {
												this.obtenerExitoOdata("Factura " + data.ID_FACTURA + ", posición " + data.DE_POSICION + ", OC " + data.OC_NUMERO_ORDEN,
													"Se registró con éxito la posición OC" + data.DE_POSICION + " - " + data.OC_NUMERO_ORDEN + " .");
											}.bind(this),
											error: function (data) {
												this.obtenerErrorOdata(data, "Error al registrar en T_FAC_POS",
													"No se pudo registrar una posición OC de la factura " + paginaCard.description + ".");
											}.bind(this)
										});
									}
									oModel.create("/T_FAC_DET", llavePos, {
										method: "POST",
										success: function (data) {
											this.obtenerExitoOdata("Factura " + data.ID_FACTURA + ", item " + data.POS_FACTURA,
												"Se registró con éxito el item de la factura " + data.POS_FACTURA + " - " + data.ID_FACTURA + " .");
										}.bind(this),
										error: function (data) {
											this.obtenerErrorOdata(data, "Error al registrar en T_FAC_DET", "No se pudo registrar un item de la factura " +
												paginaCard.description + ".");
										}.bind(this)
									});
								}

								this.getView().setBusy(false);
							}.bind(this),
							error: function (data) {
								this.obtenerErrorOdata(data, "Error al registrar en T_FAC", "No se pudo registrar la factura " + paginaCard.description +
									".");
								this.getView().setBusy(false);
							}.bind(this)
						});
						this.getView().byId("idErrores").setVisible(true);
						this.btnErrores();
					} else {
						this.getView().setBusy(false);
						var dialog = new sap.m.Dialog({
							title: "Error factura",
							type: "Message",
							state: "Error",
							icon: "sap-icon://error",
							content: new sap.m.Text({
								text: "La factura " + paginaCard.description + " ya ha sido registrada."
							}),
							beginButton: new sap.m.Button({
								text: "Aceptar",
								press: function () {
									dialog.close();
									dialog.destroy();
								}
							}),
							afterClose: function () {
								dialog.destroy();
							}
						});
						dialog.open();
					}
				}.bind(this),
				error: function (oError) {
					this.getView().setBusy(false);
					var dialog = new sap.m.Dialog({
						title: "Error",
						type: "Message",
						state: "Error",
						icon: "sap-icon://error",
						content: new sap.m.Text({
							text: "Se ha presentado un error a la hora de realizar la facturación."
						}),
						beginButton: new sap.m.Button({
							text: "Aceptar",
							press: function () {
								dialog.close();
								dialog.destroy();
							}
						}),
						afterClose: function () {
							dialog.destroy();
						}
					});
					dialog.open();
				}.bind(this)
			});

		},
	});
});