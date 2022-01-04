sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter"
], function (Controller, FileUploader, MessageToast, UploadCollectionParameter) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Reporte_Vale", {

		contPos: 0,
		contOC: 0,
		contDoc: 0,
		totalDetalle: 0,
		totalPosicion: 0,
		realizarDialog: true,
		varCorreoUsuarioGlobal: "",

		varTableURL: "",
		varTableDocument: "",
		varTableT_CEN: "",
		varTableT_CON: "",
		varTableT_CON_DET: "",
		varTableT_CRONOGRAMA: "",
		varTableT_CTR_DET: "",
		varTableT_DOC: "",
		varTableT_EMP: "",
		varTableT_FAC: "",
		varTableT_FAC_DET: "",
		varTableT_FAC_POS: "",
		varTableT_OC: "",
		varTableT_OC_DET: "",
		varTableT_ORD: "",
		varTableT_ORD_DET: "",
		varTableT_ING: "",
		varTableT_ING_DET: "",
		varTableT_TIP_CAR: "",
		varTableT_USER: "",
		varTableT_USUARIO_EMP: "",
		varTableT_USUARIO_PRO: "",
		varTableT_USUARIO_LOGIN: "",
		varTableT_RESP_ORDEN: "",

		onInit: function () {

			this.getRouter().getRoute("Vista_Reporte_Vale").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("idTableItemFacturasV").setSelectionMode("Single");
			this.getView().byId("idTableItemFacturasV").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemFacturasH").setSelectionMode("Single");
			this.getView().byId("idTableItemFacturasH").setSelectionBehavior("RowOnly");
			this.getView().byId("idDescargarPDF").addStyleClass("miIconoBlanco");
			this.getView().byId("idLogOff").addStyleClass("miIconoBlanco");
			this.getView().byId("idNavMenu").addStyleClass("miIconoBlanco");
			this.getView().byId("idFilter").addStyleClass("miIconoBlanco");
		},

		pressDocumento: function (evt) {
			var objeto = evt.getSource().getBindingContext("myParam").getObject();
			var filename = objeto.NOMBRE_DOC;
			//var uri = "/DOCUMENT/694863de149e24d473633dd5/root/" + filename;
			var uri = "" + this.varTableDocument + "/" + filename;
			var link = document.createElement("a");
			link.download = filename;
			link.href = uri;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		handleTitlePress: function (evt) {
			var factura = this.getView().byId("ohFac").getBindingContext("myParam").getObject().ID_FACTURA;

			var filename = factura + ".xml";
			//var uri = "/DOCUMENT/694863de149e24d473633dd5/root/" + filename;
			var uri = "" + this.varTableDocument + "/" + filename;
			var link = document.createElement("a");
			link.download = filename;
			link.href = uri;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onSearchFac: function (oEvt) {

			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			var valorBuscado = "";
			var oModel = this.getView().getModel("myParam");
			var tipoFiltro = oModel.getProperty("/tipoFiltro");
			if (tipoFiltro === "idVale") {
				valorBuscado = "DOC_MATERIAL";
			} else {
				valorBuscado = "HOJA_ENTRADA";
			}

			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter(valorBuscado, sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
				filter = new sap.ui.model.Filter("DOC_MATERIAL", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
				filter = new sap.ui.model.Filter("HOJA_ENTRADA", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);

				// Actualiza la lista
				var list = this.byId("idListMaster1");
				var binding = list.getBinding("items");
				binding.filter(new sap.ui.model.Filter(aFilters, false), "Application");
			} else if (sQuery.length === 0) {
				var filter = new sap.ui.model.Filter(valorBuscado, sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);

				// Actualiza la lista
				var list = this.byId("idListMaster1");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");
			}

		},
		_onRouteMatched: function () {

			// this.eliminarPruebaDocumentService("PRUEBA01.txt");
			// this.eliminarPruebaDocumentService("PRUEBA02.txt");
			var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
			oProductDetail1PanelCabecera.setVisible(false);
			this.getView().byId("idDescargarPDF").setVisible(false);
			var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
			oProductDetail1PanelIconBar.setVisible(false);
			var oModel = this.getView().getModel("myParam");
			var registroCheck = {};
			registroCheck.rTipo = true;
			registroCheck.rFecha = false;
			oModel.setProperty("/listCheck", registroCheck);
			oModel.setProperty("/tipoFiltro", "idVale");
			oModel.setProperty("/tipoFiltroDescripcion", "Doc. material disponible a facturar");
			oModel.setProperty("/listCheckAsignacion/rOpc", false);
			oModel.setProperty("/fechaDesde", new Date());
			oModel.setProperty("/fechaHasta", new Date());
			//this.inicioListaFacturas("D", "", "");
			//this.inicioListaFacturas2("D", "", "", false);

			this.getView().byId("idListMaster1").removeSelections(true);
			this.getView().byId("idTableItemFacturasV").setVisible(true);
			this.getView().byId("idTableItemFacturasH").setVisible(false);
			
			

		

			// Tablas
			this.varTableURL = oModel.getProperty("/listTablasOData/clistTablasODataURL");
			this.varTableDocument = oModel.getProperty("/listTablasOData/clistTablasODataDocument");
			this.varTableT_CEN = oModel.getProperty("/listTablasOData/clistTablasODataT_CEN");
			this.varTableT_CON = oModel.getProperty("/listTablasOData/clistTablasODataT_CON");
			this.varTableT_CON_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_CON_DET");
			this.varTableT_CRONOGRAMA = oModel.getProperty("/listTablasOData/clistTablasODataT_CRONOGRAMA");
			this.varTableT_CTR_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_CTR_DET");
			this.varTableT_DOC = oModel.getProperty("/listTablasOData/clistTablasODataT_DOC");
			this.varTableT_EMP = oModel.getProperty("/listTablasOData/clistTablasODataT_EMP");
			this.varTableT_FAC = oModel.getProperty("/listTablasOData/clistTablasODataT_FAC");
			this.varTableT_FAC_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_FAC_DET");
			this.varTableT_FAC_POS = oModel.getProperty("/listTablasOData/clistTablasODataT_FAC_POS");
			this.varTableT_OC = oModel.getProperty("/listTablasOData/clistTablasODataT_OC");
			this.varTableT_OC_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_OC_DET");
			this.varTableT_ORD = oModel.getProperty("/listTablasOData/clistTablasODataT_ORD");
			this.varTableT_ORD_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_ORD_DET");
			this.varTableT_ING = oModel.getProperty("/listTablasOData/clistTablasODataT_ING");
			this.varTableT_ING_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_ING_DET");
			this.varTableT_TIP_CAR = oModel.getProperty("/listTablasOData/clistTablasODataT_TIP_CAR");
			this.varTableT_USER = oModel.getProperty("/listTablasOData/clistTablasODataT_USER");
			this.varTableT_USUARIO_EMP = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_EMP");
			this.varTableT_USUARIO_PRO = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_PRO");
			this.varTableT_USUARIO_LOGIN = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_LOGIN");
			this.varTableT_RESP_ORDEN = oModel.getProperty("/listTablasOData/clistTablasODataT_RESP_ORDEN");
			this.varTableT_SERVICIOS = oModel.getProperty("/listTablasOData/clistTablasODataT_SERVICIOS");
			this.getUsuarioCorreo();
			oModel.setProperty("/varResponOrdenCompra", "");
			
				var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);
			oModelOData.read("/" + this.varTableT_SERVICIOS + "?$format=json", {
				success: function (response) {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						for (var i = 0; i < tamTabla; i++) {
							if(oModelJSON.getData()[i].SERVICIO === "Validacion_reporte02"){
								var valorServicio = parseInt(oModelJSON.getData()[i].CAMPO1.toString());
								var d = new Date();
								d.setDate(d.getDate() - valorServicio);
								this.btnSeleccionarFiltros2(d,new Date());
							}
						}
				}.bind(this),
				error: function (oError) {
						this.btnSeleccionarFiltros();
				}.bind(this)
			});
		},
		btnBuscarItem: function (oEvent) {
			// Llamar modelo
			var myParam = this.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var factura = oContext.getObject();

			// Obtener el ID principal de lo seleccionado
			var valObject = oContext.getPath();
			var pathFacturaItem = valObject;
			var vector = [];
			var llaveSeleccionada = {};
			llaveSeleccionada.POS = myParam.getProperty(valObject + "/POS_FACTURA");
			llaveSeleccionada.COD = myParam.getProperty(valObject + "/CODIGO");
			llaveSeleccionada.MATERIAL = myParam.getProperty(valObject + "/DESCRIPCION");
			llaveSeleccionada.NETO = myParam.getProperty(valObject + "/PRECIO_NETO");
			vector.push(llaveSeleccionada);
			myParam.setProperty("/facturaSeleccionada", vector);

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
				width: "69.3rem",
				rows: "{/clistItemsOrdenCompra}",
				noData: [
					new sap.m.Text({
						text: "Sin vales de ingreso asignados."
					})
				]
			});
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Fecha Vale"
				}),
				template: new sap.m.Text({
					text: "{FEC_VALE}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "20rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Material"
				}),
				template: new sap.ui.layout.VerticalLayout({
					width: "100%",
					content: [
						new sap.m.Text({
							text: "{DESCRIPCION}"
						}), new sap.m.Text({
							text: "{VALE_NUM}"
						})
					]
				})

			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Vale"
				}),
				template: new sap.m.Text({
					text: "{VALE}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Posición"
				}),
				template: new sap.m.Text({
					text: "{DE_POSICION}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "6rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "O.C."
				}),
				template: new sap.m.Text({
					text: "{OC_NUMERO_ORDEN}"
				})
			}));

			oTableItem.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Guía Remisión"
				}),
				template: new sap.m.Text({
					text: "{GUIA_REMISION}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cantidad"
				}),
				template: new sap.m.ObjectNumber({
					number: "{CANTIDAD}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe"
				}),
				template: new sap.m.ObjectNumber({
					number: "{PRECIO_ING}",
					unit: "{UND_MED}"
				})
			}));

			oTableItem.setModel(myParam);

			var oTableSubTotal = new sap.ui.table.Table({
				id: "idTableTotal",
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				columnHeaderVisible: false,
				width: "69.3rem",
				rows: "{/subTotal}"
			});

			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "20rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "5rem",
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
				width: "8rem",
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
				width: "7rem",
				hAlign: "Left",
				template: new sap.m.ObjectStatus({
					text: "{total}",
					state: "Information"
				})
			}));
			oTableSubTotal.setModel(myParam);

			// var varPosicionFactura = oModel.getProperty(valObject + "/clistItemDetalleFacturaPosicion");
			// var varCodigoFactura = oModel.getProperty(valObject + "/clistItemDetalleFacturaCodigo");
			// var varDescripcionFactura = oModel.getProperty(valObject + "/clistItemDetalleFacturaDescripcion");
			// var varValortotalNetoFactura = oModel.getProperty(valObject + "/clistItemDetalleFacturaValortotalNetoXItem");

			var hbox = new sap.m.HBox({
				justifyContent: "Center",
				width: "100%"
			});
			hbox.addItem(oTable);
			var oDialogSelectItems = new sap.m.Dialog({

				title: "Detalle de la posición",
				icon: "sap-icon://menu",
				contentWidth: "auto",
				resizable: true,
				draggable: true,
				type: "Message",
				content: [
					hbox,
					new sap.m.Toolbar({
						width: "100%",
						content: [
							new sap.m.Label({
								design: "Bold",
								text: "Tabla de asignación por Vales de Ingreso"
							}),
							new sap.m.ToolbarSpacer({})

						]
					}),

					oTableItem,
					oTableSubTotal
				],
				endButton: new sap.m.Button({
					text: 'Aceptar',
					type: 'Emphasized',
					icon: 'sap-icon://accept',
					press: function () {

						myParam.setProperty("/clistItemsOrdenCompra", []);
						myParam.setProperty("/subTotal", []);
						oDialogSelectItems.close();
					}.bind(this)
				}),
				afterClose: function () {
					oDialogSelectItems.destroy();
				},
				afterOpen: function () {

					//var url = "/public/proveedores/tablap.xsodata";
					var url = "" + this.varTableURL + "";
					var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
					var filters = [];
					var filter;
					filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, factura.ID_FACTURA);
					filters.push(filter);
					filter = new sap.ui.model.Filter("POS_FACTURA", sap.ui.model.FilterOperator.EQ, factura.POS_FACTURA);
					filters.push(filter);
					//oModel.read("/T_FAC_POS?$format=json", {
					oModel.read("/" + this.varTableT_FAC_POS + "?$format=json", {
						filters: filters,
						success: function (response) {

							var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
							var lenghtV = oModelJSON.getData().length;
							myParam.setProperty("/clistItemsOrdenCompra", oModelJSON.getData());
							var total = 0;
							for (var i = 0; i < lenghtV; i++) {
								total += parseFloat(oModelJSON.getData()[i].PRECIO_ING.toString());
							}
							total = total.toFixed(2);
							var subTotal = [];
							var llaveSub = {};
							llaveSub.total = total;
							subTotal.push(llaveSub);
							myParam.setProperty("/subTotal", subTotal);
							oTableItem.getBinding("rows").refresh(true);
							oTableSubTotal.getBinding("rows").refresh(true);
						}.bind(this),
						error: function (oError) {
							myParam.setProperty("/clistItemsOrdenCompra", []);
							myParam.setProperty("/subTotal", []);
							oTableItem.getBinding("rows").refresh(true);
							oTableSubTotal.getBinding("rows").refresh(true);
						}.bind(this)
					});

				}.bind(this)
			});

			oDialogSelectItems.open();
		},
		onAfterRendering: function () {

			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			// Tablas
			this.varTableURL = oModel.getProperty("/listTablasOData/clistTablasODataURL");
			this.varTableDocument = oModel.getProperty("/listTablasOData/clistTablasODataDocument");
			this.varTableT_CEN = oModel.getProperty("/listTablasOData/clistTablasODataT_CEN");
			this.varTableT_CON = oModel.getProperty("/listTablasOData/clistTablasODataT_CON");
			this.varTableT_CON_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_CON_DET");
			this.varTableT_CRONOGRAMA = oModel.getProperty("/listTablasOData/clistTablasODataT_CRONOGRAMA");
			this.varTableT_CTR_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_CTR_DET");
			this.varTableT_DOC = oModel.getProperty("/listTablasOData/clistTablasODataT_DOC");
			this.varTableT_EMP = oModel.getProperty("/listTablasOData/clistTablasODataT_EMP");
			this.varTableT_FAC = oModel.getProperty("/listTablasOData/clistTablasODataT_FAC");
			this.varTableT_FAC_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_FAC_DET");
			this.varTableT_FAC_POS = oModel.getProperty("/listTablasOData/clistTablasODataT_FAC_POS");
			this.varTableT_OC = oModel.getProperty("/listTablasOData/clistTablasODataT_OC");
			this.varTableT_OC_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_OC_DET");
			this.varTableT_ORD = oModel.getProperty("/listTablasOData/clistTablasODataT_ORD");
			this.varTableT_ORD_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_ORD_DET");
			this.varTableT_ING = oModel.getProperty("/listTablasOData/clistTablasODataT_ING");
			this.varTableT_ING_DET = oModel.getProperty("/listTablasOData/clistTablasODataT_ING_DET");
			this.varTableT_TIP_CAR = oModel.getProperty("/listTablasOData/clistTablasODataT_TIP_CAR");
			this.varTableT_USER = oModel.getProperty("/listTablasOData/clistTablasODataT_USER");
			this.varTableT_USUARIO_EMP = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_EMP");
			this.varTableT_USUARIO_PRO = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_PRO");
			this.varTableT_USUARIO_LOGIN = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_LOGIN");
			this.varTableT_RESP_ORDEN = oModel.getProperty("/listTablasOData/clistTablasODataT_RESP_ORDEN");
			this.varTableT_SERVICIOS = oModel.getProperty("/listTablasOData/clistTablasODataT_SERVICIOS");
			this.getUsuarioCorreo();
			oModel.setProperty("/varResponOrdenCompra", "");
		},

		getUsuarioCorreo: function () {

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var varUsuario = oModel.getProperty("/usuarioLogin");

			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);

			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.EQ, varUsuario);
			filters.push(filter);

			oModelJson.read("/" + this.varTableT_USER + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var vartblUser = oModelJSON.getData();
					var lenghtV = oModelJSON.getData().length;

					if (lenghtV !== 0) {
						this.varCorreoUsuarioGlobal = oModelJSON.getData()[0].EMAIL;
					}

				}.bind(this),
				error: function (oError) {
				}.bind(this)
			});
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
				if (formato.includes("doc")) {
					return "sap-icon://doc-attachment";
				} else if (formato.includes("png") || formato.includes("ppm") || formato.includes("pgm") || formato.includes("pbm") || formato.includes(
						"pnm") || formato.includes("jp")) {
					return "sap-icon://picture";
				} else if (formato.includes("pdf")) {
					return "sap-icon://pdf-attachment";
				} else if (formato.includes("xls") || formato.includes("csv")) {
					return "sap-icon://excel-attachment";
				} else if (formato.includes("xml")) {
					return "sap-icon://document-text";
				} else {
					return "sap-icon://document";
				}
			} else {
				return "sap-icon://document";
			}
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
			valor1 = parseInt(valor1);
			valor2 = parseInt(valor2);
			valor3 = parseInt(valor3.toString());
			var calculo = valor1 - valor2 - valor3;
			return calculo.toString();
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
		btnRegresarMenu: function () {
			//	this.getView().byId("idTableItemFacturas").removeSelections(true);
			this.getRouter().navTo("Vista_Menu_Principal");
			this.getView().byId("idDescargarPDF").setVisible(false);
			this.getView().byId("idListMaster1").removeSelections(true);
		},
		clicItemFactura: function (oEvent) {
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var itemSeleccionado = oEvent.getSource().getSelectedItem();
			var factura = itemSeleccionado.getBindingContext("myParam").getObject();
			oModel.setProperty("/listConsultaResumenFacturaCabecera", factura);
			var varlistReporteValeDetalle = oModel.getProperty("/listReporteValeDetalle");

			// Detalle
			var varCont = 0;
			var vector = [];
			var llave = {};
			var varSumaTotal = 0;
			var varSumaCantidad = 0;
			var varMoneda = "";
			var precioTotal = 0;
			for (var i = 0; i < varlistReporteValeDetalle.length; i++) {
				if (varlistReporteValeDetalle[i].US_RUC === factura.US_RUC &&
					varlistReporteValeDetalle[i].EM_RUC === factura.EM_RUC &&
					varlistReporteValeDetalle[i].DE_HOJA_ENTRADA === factura.HOJA_ENTRADA &&
					varlistReporteValeDetalle[i].DE_DOC_MATERIAL === factura.DOC_MATERIAL) {
						precioTotal = 	varlistReporteValeDetalle[i].DE_TOTAL;
							precioTotal = precioTotal.replace(/,/g, '');
					varSumaTotal = parseFloat(varSumaTotal, 10) + parseFloat(precioTotal, 10);
					varSumaCantidad = parseFloat(varSumaCantidad, 10) + parseFloat(varlistReporteValeDetalle[i].DE_CANTIDAD, 10);
					varMoneda = varlistReporteValeDetalle[i].DE_MONEDA;

					llave = {};
					llave = varlistReporteValeDetalle[i];
					vector.push(llave);

					varCont++;
				}
			}
				var sumaTotal = varSumaTotal.toFixed(2);
			sumaTotal = this.numberWithCommas(sumaTotal);
			this.getView().byId("idlistConsultaResumenFacturaCabeceraCantidad").setText(varSumaCantidad);
			this.getView().byId("ohFac").setNumber(sumaTotal);
			this.getView().byId("ohFac").setNumberUnit(varMoneda);

			oModel.setProperty("/listConsultaResumenFacturaDetalle", vector);

			this.getView().byId("idlistConsultaResumenFacturaCabeceraPosiciones").setText(varCont);

			var varMensajeFlacEstado = "";
			var varStateFlacEstado = "";
			if (factura.FLAC === "") {
				varMensajeFlacEstado = "Disponible para facturar";
				varStateFlacEstado = "Success";
			} else {
				varMensajeFlacEstado = "Asignado a factura";
				varStateFlacEstado = "Information";
			}
			this.getView().byId("idlistConsultaResumenFacturaCabeceraEstado").setText(varMensajeFlacEstado);
			this.getView().byId("idlistConsultaResumenFacturaCabeceraEstado").setState(varStateFlacEstado);

			this.getView().byId("idDescargarPDF").setVisible(true);
			this.getView().byId("ohFac").setVisible(true);
			this.getView().byId("idTabBarFac").setVisible(true);
			this.getDataOrdenCompra();

		},
			 numberWithCommas:function(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
},
		formatoValeHoja: function (docMaterial, hojaServicio, guia, centro, tipo) {

			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var varDetalleCabecera = oModel.getProperty("/listConsultaResumenFacturaCabecera");
			var varLista = oModel.getProperty("/listReporteVale");
			if (tipo === "D" || tipo === "S") {
				this.getView().byId("idTitleGuiaCentro").setTitle("Guía Remisión");
				this.getView().byId("idTitleGuiaCentro").setText(guia);
				this.getView().byId("ohFac").setIntro("Guía Remisión : " + guia);
				return "Documento de ingreso: " + docMaterial;
			} else {
				this.getView().byId("idTitleGuiaCentro").setTitle("Centro");
				this.getView().byId("idTitleGuiaCentro").setText(centro);
				this.getView().byId("ohFac").setIntro("Centro : " + centro);
				return "HES: " + hojaServicio;
			}
		},
		formatoValeHoja2: function (docMaterial, hojaServicio, tipo) {
			if (tipo === "D" || tipo === "S") {
				return parseInt(docMaterial, 10);
			} else {
				return hojaServicio;
			}
		},
		formatoValeHoja3: function (valor) {

			return parseInt(valor, 10);
		},
		formatoValeHoja4: function (tipo) {

			if (tipo === "S") {
				return "Suministro";
			} else if (tipo === "H") {
				return "Servicio";
			} else if (tipo === "D") {
				return "Devolución";
			} else if (tipo === "S") {
				return "Suministro";
			}
		},
		btnSeleccionarFiltros2: function (fecha01,fecha02) {
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var buttonTipo = new sap.m.SegmentedButton({
				selectedKey: oModel.getProperty("/tipoFiltro"),
				selectionChange: function (oEvent) {
					var varOpcionTextoAsigancion = oEvent.getParameter("item").getText();
					if (varOpcionTextoAsigancion === "Servicios/Activos") {
						sap.ui.getCore().byId("idTextoAsignacion").setText("HES disponible a facturar");
					} else if (varOpcionTextoAsigancion === "Bienes") {
						sap.ui.getCore().byId("idTextoAsignacion").setText("Doc. material disponible a facturar");
					}
				},
				width: "100%"
			});
			var item = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://sales-quote",
				text: "Bienes",
				key: "idVale"
			});
			buttonTipo.addItem(item);
			item = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://ppt-attachment",
				text: "Servicios/Activos",
				key: "idHoja"
			});
			buttonTipo.addItem(item);
			var oDialog = new sap.m.Dialog({
				icon: 'sap-icon://filter',
				title: "Asigne filtros",
				resizable: true,
				draggable: true,
				contentWidth: "350px",
				type: "Message",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [
							new sap.m.CheckBox("idCheckTipo", {
								selected: oModel.getProperty("/listCheck").rTipo,
								editable: false,
								select: function (evt) {
									var seleccionado = evt.getSource().getSelected();
									if (seleccionado) {
										buttonTipo.setEnabled(true);
									} else {
										buttonTipo.setEnabled(false);
									}
								}
							}), new sap.m.Label({
								text: "Filtro por tipo de documento",
								width: "100%"
							})
						]
					}),
					buttonTipo,
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [
							new sap.m.CheckBox("idCheckFecha", {
								selected: true,
								select: function (evt) {
									var seleccionado = evt.getSource().getSelected();
									if (seleccionado) {
										sap.ui.getCore().byId("idFecDesde").setEnabled(true);
										sap.ui.getCore().byId("idFecHasta").setEnabled(true);
									} else {
										sap.ui.getCore().byId("idFecHasta").setEnabled(false);
										sap.ui.getCore().byId("idFecDesde").setEnabled(false);
									}
								}
							}), new sap.m.Label({
								text: "Filtro por entre fechas",
								width: "100%"
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
							text: "Fecha desde: ",
							width: "40%",
							textAlign: "Left",
							design: "Bold"
						}), new sap.m.DatePicker("idFecDesde", {
							valueStateText: "El campo fecha desde no debe estar vacío.",
							valueFormat: "yyyyMMdd",
							displayFormat: "yyyy-MM-dd",
							dateValue: fecha01,
							width: "60%"
						})]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
							text: "Fecha hasta: ",
							width: "40%",
							textAlign: "Left",
							design: "Bold"
						}), new sap.m.DatePicker("idFecHasta", {
							valueStateText: "El campo fecha hasta no debe estar vacío.",
							valueFormat: "yyyyMMdd",
							displayFormat: "yyyy-MM-dd",
							dateValue: fecha02,
							width: "60%"
						})]
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [
							new sap.m.CheckBox("idCheckAsignacion", {
								selected: oModel.getProperty("/listCheckAsignacion").rOpc,
								select: function (evt) {
									var seleccionado = evt.getSource().getSelected();

									var registroCheckAsig = {};
									registroCheckAsig.rOpc = seleccionado;
									oModel.setProperty("/listCheckAsignacion", registroCheckAsig);
								}
							}),
							new sap.m.Label("idTextoAsignacion", {
								text: oModel.getProperty("/tipoFiltroDescripcion"),
								wrapping: true,
								width: "100%"
							})
						]
					})
				],
				afterClose: function () {
					oDialog.destroy();
				},
				afterOpen: function () {
					var selectTipo = oModel.getProperty("/listCheck").rTipo;
					if (selectTipo) {
						buttonTipo.setEnabled(true);
					} else {
						buttonTipo.setEnabled(false);
					}
					// var selectFecha = oModel.getProperty("/listCheck").rFecha;
					// if (selectFecha) {
					// 	sap.ui.getCore().byId("idFecDesde").setEnabled(true);
					// 	sap.ui.getCore().byId("idFecHasta").setEnabled(true);
					// } else {
					// 	sap.ui.getCore().byId("idFecHasta").setEnabled(false);
					// 	sap.ui.getCore().byId("idFecDesde").setEnabled(false);
					// }
				},
				beginButton: new sap.m.Button({
					text: 'Filtrar',
					icon: 'sap-icon://add-filter',
					press: function () {
						var chkTipo = sap.ui.getCore().byId("idCheckTipo").getSelected();
						var chkFecha = sap.ui.getCore().byId("idCheckFecha").getSelected();
						var varChkAsigancion = sap.ui.getCore().byId("idCheckAsignacion").getSelected();
						var validarFecha = true;
						if (chkFecha) {
							var inputs = [sap.ui.getCore().byId("idFecDesde"),
								sap.ui.getCore().byId("idFecHasta")
							];
							jQuery.each(inputs, function (i, input) {
								if (!input.getValue()) {
									input.setValueState("Error");
									validarFecha = false;
								} else {
									input.setValueState("None");
								}
							});
						}

						var tipoButtonDescripcion = buttonTipo.getSelectedKey();
						if (tipoButtonDescripcion === "idVale") {
							oModel.setProperty("/tipoFiltroDescripcion", "Doc. material disponible a facturar");
						} else if (tipoButtonDescripcion === "idHoja") {
							oModel.setProperty("/tipoFiltroDescripcion", "HES disponible a facturar");
						}

						if (validarFecha) {
							var tipoButton = buttonTipo.getSelectedKey();
							oModel.setProperty("/tipoFiltro", tipoButton);

							var registroCheck = {};
							registroCheck.rTipo = chkTipo;
							registroCheck.rFecha = chkFecha;
							oModel.setProperty("/listCheck", registroCheck);
							var param01 = "";
							if (tipoButton === "idVale") {
								param01 = "D";
								this.getView().byId("idTituloSumBin").setText("Reporte de Bienes");
							} else {
								param01 = "H";
								this.getView().byId("idTituloSumBin").setText("Reporte de Servicios");
							}

							if (chkFecha) {
								var fechaDesde = sap.ui.getCore().byId("idFecDesde").getDateValue();
								var fechaHasta = sap.ui.getCore().byId("idFecHasta").getDateValue();
								oModel.setProperty("/fechaDesde", fechaDesde);
								oModel.setProperty("/fechaHasta", fechaHasta);
								var fechaDesdeV = sap.ui.getCore().byId("idFecDesde").getValue();
								var idFecHastaV = sap.ui.getCore().byId("idFecHasta").getValue();
								//this.inicioListaFacturas(param01, fechaDesdeV, idFecHastaV);
								this.inicioListaFacturas2(param01, fechaDesdeV, idFecHastaV, varChkAsigancion);
							} else {
								//this.inicioListaFacturas(param01, "", "");
								this.inicioListaFacturas2(param01, "", "", varChkAsigancion);
							}
							oDialog.close();
						} else {
							sap.m.MessageToast.show("Se requiere ingresar todas las fechas.");
						}
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: 'sap-icon://sys-cancel',
					press: function () {
						oDialog.close();
					}.bind(this)
				}),
			});
			oDialog.addStyleClass("sapUiSizeCompact");
			oDialog.open();
		},
		btnSeleccionarFiltros: function () {
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var buttonTipo = new sap.m.SegmentedButton({
				selectedKey: oModel.getProperty("/tipoFiltro"),
				selectionChange: function (oEvent) {
					var varOpcionTextoAsigancion = oEvent.getParameter("item").getText();
					if (varOpcionTextoAsigancion === "Servicios/Activos") {
						sap.ui.getCore().byId("idTextoAsignacion").setText("HES disponible a facturar");
					} else if (varOpcionTextoAsigancion === "Bienes") {
						sap.ui.getCore().byId("idTextoAsignacion").setText("Doc. material disponible a facturar");
					}
				},
				width: "100%"
			});
			var item = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://sales-quote",
				text: "Bienes",
				key: "idVale"
			});
			buttonTipo.addItem(item);
			item = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://ppt-attachment",
				text: "Servicios/Activos",
				key: "idHoja"
			});
			buttonTipo.addItem(item);
			var oDialog = new sap.m.Dialog({
				icon: 'sap-icon://filter',
				title: "Asigne filtros",
				resizable: true,
				draggable: true,
				contentWidth: "350px",
				type: "Message",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [
							new sap.m.CheckBox("idCheckTipo", {
								selected: oModel.getProperty("/listCheck").rTipo,
								editable: false,
								select: function (evt) {
									var seleccionado = evt.getSource().getSelected();
									if (seleccionado) {
										buttonTipo.setEnabled(true);
									} else {
										buttonTipo.setEnabled(false);
									}
								}
							}), new sap.m.Label({
								text: "Filtro por tipo de documento",
								width: "100%"
							})
						]
					}),
					buttonTipo,
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [
							new sap.m.CheckBox("idCheckFecha", {
								selected: oModel.getProperty("/listCheck").rFecha,
								select: function (evt) {
									var seleccionado = evt.getSource().getSelected();
									if (seleccionado) {
										sap.ui.getCore().byId("idFecDesde").setEnabled(true);
										sap.ui.getCore().byId("idFecHasta").setEnabled(true);
									} else {
										sap.ui.getCore().byId("idFecHasta").setEnabled(false);
										sap.ui.getCore().byId("idFecDesde").setEnabled(false);
									}
								}
							}), new sap.m.Label({
								text: "Filtro por entre fechas",
								width: "100%"
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
							text: "Fecha desde: ",
							width: "40%",
							textAlign: "Left",
							design: "Bold"
						}), new sap.m.DatePicker("idFecDesde", {
							valueStateText: "El campo fecha desde no debe estar vacío.",
							valueFormat: "yyyyMMdd",
							displayFormat: "yyyy-MM-dd",
							dateValue: oModel.getProperty("/fechaDesde"),
							width: "60%"
						})]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
							text: "Fecha hasta: ",
							width: "40%",
							textAlign: "Left",
							design: "Bold"
						}), new sap.m.DatePicker("idFecHasta", {
							valueStateText: "El campo fecha hasta no debe estar vacío.",
							valueFormat: "yyyyMMdd",
							displayFormat: "yyyy-MM-dd",
							dateValue: oModel.getProperty("/fechaHasta"),
							width: "60%"
						})]
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [
							new sap.m.CheckBox("idCheckAsignacion", {
								selected: oModel.getProperty("/listCheckAsignacion").rOpc,
								select: function (evt) {
									var seleccionado = evt.getSource().getSelected();

									var registroCheckAsig = {};
									registroCheckAsig.rOpc = seleccionado;
									oModel.setProperty("/listCheckAsignacion", registroCheckAsig);
								}
							}),
							new sap.m.Label("idTextoAsignacion", {
								text: oModel.getProperty("/tipoFiltroDescripcion"),
								wrapping: true,
								width: "100%"
							})
						]
					})
				],
				afterClose: function () {
					oDialog.destroy();
				},
				afterOpen: function () {
					var selectTipo = oModel.getProperty("/listCheck").rTipo;
					if (selectTipo) {
						buttonTipo.setEnabled(true);
					} else {
						buttonTipo.setEnabled(false);
					}
					var selectFecha = oModel.getProperty("/listCheck").rFecha;
					if (selectFecha) {
						sap.ui.getCore().byId("idFecDesde").setEnabled(true);
						sap.ui.getCore().byId("idFecHasta").setEnabled(true);
					} else {
						sap.ui.getCore().byId("idFecHasta").setEnabled(false);
						sap.ui.getCore().byId("idFecDesde").setEnabled(false);
					}
				},
				beginButton: new sap.m.Button({
					text: 'Filtrar',
					icon: 'sap-icon://add-filter',
					press: function () {
						var chkTipo = sap.ui.getCore().byId("idCheckTipo").getSelected();
						var chkFecha = sap.ui.getCore().byId("idCheckFecha").getSelected();
						var varChkAsigancion = sap.ui.getCore().byId("idCheckAsignacion").getSelected();
						var validarFecha = true;
						if (chkFecha) {
							var inputs = [sap.ui.getCore().byId("idFecDesde"),
								sap.ui.getCore().byId("idFecHasta")
							];
							jQuery.each(inputs, function (i, input) {
								if (!input.getValue()) {
									input.setValueState("Error");
									validarFecha = false;
								} else {
									input.setValueState("None");
								}
							});
						}

						var tipoButtonDescripcion = buttonTipo.getSelectedKey();
						if (tipoButtonDescripcion === "idVale") {
							oModel.setProperty("/tipoFiltroDescripcion", "Doc. material disponible a facturar");
						} else if (tipoButtonDescripcion === "idHoja") {
							oModel.setProperty("/tipoFiltroDescripcion", "HES disponible a facturar");
						}

						if (validarFecha) {
							var tipoButton = buttonTipo.getSelectedKey();
							oModel.setProperty("/tipoFiltro", tipoButton);

							var registroCheck = {};
							registroCheck.rTipo = chkTipo;
							registroCheck.rFecha = chkFecha;
							oModel.setProperty("/listCheck", registroCheck);
							var param01 = "";
							if (tipoButton === "idVale") {
								param01 = "D";
								this.getView().byId("idTituloSumBin").setText("Reporte de Bienes");
							} else {
								param01 = "H";
								this.getView().byId("idTituloSumBin").setText("Reporte de Servicios");
							}

							if (chkFecha) {
								var fechaDesde = sap.ui.getCore().byId("idFecDesde").getDateValue();
								var fechaHasta = sap.ui.getCore().byId("idFecHasta").getDateValue();
								oModel.setProperty("/fechaDesde", fechaDesde);
								oModel.setProperty("/fechaHasta", fechaHasta);
								var fechaDesdeV = sap.ui.getCore().byId("idFecDesde").getValue();
								var idFecHastaV = sap.ui.getCore().byId("idFecHasta").getValue();
								//this.inicioListaFacturas(param01, fechaDesdeV, idFecHastaV);
								this.inicioListaFacturas2(param01, fechaDesdeV, idFecHastaV, varChkAsigancion);
							} else {
								//this.inicioListaFacturas(param01, "", "");
								this.inicioListaFacturas2(param01, "", "", varChkAsigancion);
							}
							oDialog.close();
						} else {
							sap.m.MessageToast.show("Se requiere ingresar todas las fechas.");
						}
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: 'sap-icon://sys-cancel',
					press: function () {
						oDialog.close();
					}.bind(this)
				}),
			});
			oDialog.addStyleClass("sapUiSizeCompact");
			oDialog.open();
		},

		inicioListaFacturas2: function (tipo, fecha1, fecha2, asignacion) {

			this.getView().byId("master1").setBusy(true);
			var oModelMyParam = this.getView().getModel("myParam");
			//var url = "/public/proveedores/tablap.xsodata";
			var url = "" + this.varTableURL + "";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var oThis = this;
			var oModel2 = oThis.getView().getModel("myParam");
			var usuarioRuc = oModel2.getProperty("/usuarioRuc");
			var usuarioLogin = oModel2.getProperty("/usuarioLogin");
			// Mostrar JSON
			var filters1 = [];
			var filters2 = [];
			var sorters = [];
			var sorters2 = [];
			var filter1;
			var filter2;
			var sorter;
			var sorter2;
			var filters_t_1_1 = [];
			var filters_t_1_2 = [];
			var filters_t_2_1 = [];
			var filters_t_2_2 = [];

			if (tipo === "D") {
				filter1 = new sap.ui.model.Filter("TIPO", sap.ui.model.FilterOperator.EQ, "D");
				filters_t_1_1.push(filter1);
				filter1 = new sap.ui.model.Filter("TIPO", sap.ui.model.FilterOperator.EQ, "S");
				filters_t_1_1.push(filter1);
				filters1.push(new sap.ui.model.Filter(filters_t_1_1, false));
			} else if (tipo === "H") {
				filter1 = new sap.ui.model.Filter("TIPO", sap.ui.model.FilterOperator.EQ, tipo);
				filters1.push(filter1);
			}

			filter1 = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, usuarioRuc);
			filters1.push(filter1);
			filter1 = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
			filters1.push(filter1);
			sorter = new sap.ui.model.Sorter("FEC_RECEPCION", true);
			sorters.push(sorter);
			if (tipo === "S" || tipo === "D") {
				sorter = new sap.ui.model.Sorter("DOC_MATERIAL", true);
				sorters.push(sorter);
			} else if (tipo === "H") {
				sorter = new sap.ui.model.Sorter("HOJA_ENTRADA", true);
				sorters.push(sorter);
			}

			oModel.read("/" + this.varTableT_ING + "?$format=json", {
				filters: filters1,
				sorters: sorters,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;

					var filter1OC;
					var filters1OC = [];
					var filters_t_1_1OC = [];

					if (tipo === "D") {
						filter1OC = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, "D");
						filters_t_1_1OC.push(filter1OC);
						filter1OC = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, "S");
						filters_t_1_1OC.push(filter1OC);
						filters1OC.push(new sap.ui.model.Filter(filters_t_1_1OC, false));
					} else if (tipo === "H") {
						filter1OC = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, tipo);
						filters1OC.push(filter1);
					}

					filter1OC = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, usuarioRuc);
					filters1OC.push(filter1OC);
					filter1OC = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
					filters1OC.push(filter1OC);
					oModel.read("/" + this.varTableT_OC_DET + "?$format=json", {
						filters: filters1OC,
						success: function (response) {

							var oModelJSONOC = new sap.ui.model.json.JSONModel(response.results);
							var lenghtVOC = oModelJSONOC.getData().length;

							var vectorOC = [];
							var llaveOC = {};

							for (var i = 0; i < lenghtVOC; i++) {
								llaveOC = {};
								llaveOC = oModelJSONOC.getData()[i];
								vectorOC.push(llaveOC);
							}

							var vector = [];
							var llave = {};

							for (var i = 0; i < lenghtV; i++) {
								llave = {};
								llave.AZO = oModelJSON.getData()[i].AZO;
								llave.BUKRS = oModelJSON.getData()[i].BUKRS;
								llave.CENTROS = oModelJSON.getData()[i].CENTROS;
								llave.COMPRADORS = oModelJSON.getData()[i].COMPRADORS;
								llave.DIRECCION = oModelJSON.getData()[i].DIRECCION;
								llave.DOC_MATERIAL = oModelJSON.getData()[i].DOC_MATERIAL;
								llave.DOC_PROVEEDOR = oModelJSON.getData()[i].DOC_PROVEEDOR;
								llave.EM_RUC = oModelJSON.getData()[i].EM_RUC;
								llave.FEC_RECEPCION = oModelJSON.getData()[i].FEC_RECEPCION;
								llave.FEC_RECEPCIONNEW = this.formatoFecha(oModelJSON.getData()[i].FEC_RECEPCION);
								var fechaRegistro = oModelJSON.getData()[i].FEC_RECEPCION;
								llave.GUIA_REMISION = oModelJSON.getData()[i].GUIA_REMISION;
								llave.HOJA_ENTRADA = oModelJSON.getData()[i].HOJA_ENTRADA;
								llave.LIFNR = oModelJSON.getData()[i].LIFNR;
								llave.NRO_CONTRATO = oModelJSON.getData()[i].NRO_CONTRATO;
								llave.NROSOLICITU = oModelJSON.getData()[i].NROSOLICITU;
								llave.NUMERO_ORDEN = oModelJSON.getData()[i].NUMERO_ORDEN;
								llave.POSICION_ORDEN = oModelJSON.getData()[i].POSICION_ORDEN;
								llave.SOLICITUDS = oModelJSON.getData()[i].SOLICITUDS;
								llave.TIPO = oModelJSON.getData()[i].TIPO;
								llave.US_RUC = oModelJSON.getData()[i].US_RUC;
								llave.USUARIO = oModelJSON.getData()[i].USUARIO;
								llave.FLAC = "";
								for (var j = 0; j < vectorOC.length; j++) {
									if (oModelJSON.getData()[i].HOJA_ENTRADA === vectorOC[j].DE_HOJA_ENTRADA &&
										oModelJSON.getData()[i].EM_RUC === vectorOC[j].EM_RUC &&
										oModelJSON.getData()[i].DOC_MATERIAL === vectorOC[j].DE_DOC_MATERIAL &&
										oModelJSON.getData()[i].US_RUC === vectorOC[j].US_RUC &&
										oModelJSON.getData()[i].NUMERO_ORDEN === vectorOC[j].DE_NUMERO_ORDEN &&
										oModelJSON.getData()[i].POSICION_ORDEN === vectorOC[j].DE_POSICION &&
										vectorOC[j].DE_FLAC !== "") {
										llave.FLAC = "X";
									}
								}

								if (fecha1 !== "") {
									fechaRegistro = fechaRegistro.split("-");
									fechaRegistro = fechaRegistro[0] + "" + fechaRegistro[1] + "" + fechaRegistro[2];
									fechaRegistro = parseInt(fechaRegistro.toString(), 10);
									if (parseInt(fecha2, 10) >= fechaRegistro && parseInt(fecha1, 10) <= fechaRegistro) {
										vector.push(llave);
									}
								} else {
									vector.push(llave);
								}
							}

							var vectorFlac = [];
							var llaveFlac = {};
							if (asignacion) {
								for (var i = 0; i < vector.length; i++) {
									if (vector[i].FLAC !== "X") {
										llaveFlac = {};
										llaveFlac = vector[i];
										vectorFlac.push(llaveFlac);
									}
								}
								oModelMyParam.setProperty("/listReporteVale", vectorFlac);
							} else {
								oModelMyParam.setProperty("/listReporteVale", vector);
							}

							//oModelMyParam.setProperty("/listReporteVale", vector);
							if (tipo === "D" || tipo === "S") {
								this.getView().byId("idTituloOrden").setText("Lista de Bienes (" + vector.length + ")");
								this.getView().byId("idListMaster1").removeSelections(true);
								this.getView().byId("idTableItemFacturasV").setVisible(true);
								this.getView().byId("idTableItemFacturasH").setVisible(false);
							} else {
								this.getView().byId("idTituloOrden").setText("Lista de Servicios/Activos (" + vector.length + ")");
								this.getView().byId("idListMaster1").removeSelections(true);
								this.getView().byId("idTableItemFacturasV").setVisible(false);
								this.getView().byId("idTableItemFacturasH").setVisible(true);
							}
							var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
							oProductDetail1PanelCabecera.setVisible(false);
							this.getView().byId("idDescargarPDF").setVisible(false);
							var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
							oProductDetail1PanelIconBar.setVisible(false);
							this.getView().byId("master1").setBusy(false);

						}.bind(this),
						error: function (oError) {}.bind(this)
					});

				}.bind(this),
				error: function (oError) {
					oModel2.setProperty("/listReporteVale", []);
					this.getView().byId("idTituloOrden").setText("Lista de Vales (0)");
					this.getView().byId("master1").setBusy(false);
				}.bind(this)
			});

			if (tipo === "D") {
				filter2 = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, "D");
				filters_t_2_1.push(filter2);
				filter2 = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, "S");
				filters_t_2_1.push(filter2);
				filters2.push(new sap.ui.model.Filter(filters_t_2_1, false));
			} else if (tipo === "H") {
				filter2 = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, tipo);
				filters2.push(filter2);
			}

			filter2 = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, usuarioRuc);
			filters2.push(filter2);
			filter2 = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
			filters2.push(filter2);
			sorter2 = new sap.ui.model.Sorter("DE_POS_DOC_MATERIAL", false);
			sorters2.push(sorter2);

			oModel.read("/" + this.varTableT_ING_DET + "?$format=json", {
				filters: filters2,
				sorters: sorters2,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;

					var vector = [];
					var llave = {};

					for (var i = 0; i < lenghtV; i++) {
						llave = {};
						llave = oModelJSON.getData()[i];
						/*llave.DE_POS_DOC_MATERIAL = oModelJSON.getData()[i].DE_POS_DOC_MATERIAL;
						llave.DE_DOC_MATERIAL = oModelJSON.getData()[i].DE_DOC_MATERIAL;
						llave.DE_HOJA_ENTRADA = oModelJSON.getData()[i].DE_HOJA_ENTRADA;
						llave.DE_NUM_LINEA = oModelJSON.getData()[i].DE_NUM_LINEA;
						llave.EM_RUC = oModelJSON.getData()[i].EM_RUC;
						llave.US_RUC = oModelJSON.getData()[i].US_RUC;
						llave.ALMACEN = oModelJSON.getData()[i].ALMACEN;
						llave.CENTROS = oModelJSON.getData()[i].CENTROS;
						llave.CENTROV = oModelJSON.getData()[i].CENTROV;
						llave.COMPRADORS = oModelJSON.getData()[i].COMPRADORS;
						llave.COMPRADORV = oModelJSON.getData()[i].COMPRADORV;
						llave.DE_ANO = oModelJSON.getData()[i].DE_ANO;
						llave.DE_CANTIDAD = oModelJSON.getData()[i].DE_CANTIDAD;
						llave.DE_CANTIDAD_A_FACTURAR = oModelJSON.getData()[i].DE_CANTIDAD_A_FACTURAR;
						llave.DE_COD_EMPRESA = oModelJSON.getData()[i].DE_COD_EMPRESA;
						llave.DE_CONDICION = oModelJSON.getData()[i].DE_CONDICION;
						llave.DE_DESCRIPCION = oModelJSON.getData()[i].DE_DESCRIPCION;
						llave.DE_DIRECCION = oModelJSON.getData()[i].DE_DIRECCION;
						llave.DE_ESTADO = oModelJSON.getData()[i].DE_ESTADO;
						llave.DE_FACTURA = oModelJSON.getData()[i].DE_FACTURA;
						llave.DE_FEC_ACEPTACION = oModelJSON.getData()[i].DE_FEC_ACEPTACION;
						llave.DE_FEC_CONTABILIZACION = oModelJSON.getData()[i].DE_FEC_CONTABILIZACION;
						llave.DE_FEC_REGISTRO = oModelJSON.getData()[i].DE_FEC_REGISTRO;
						llave.DE_FLAC = oModelJSON.getData()[i].DE_FLAC;
						llave.DE_GUIA_REMISION = oModelJSON.getData()[i].DE_GUIA_REMISION;
						llave.DE_IGV = oModelJSON.getData()[i].DE_IGV;
						llave.DE_LIBERADO = oModelJSON.getData()[i].DE_LIBERADO;
						llave.DE_MONEDA = oModelJSON.getData()[i].DE_MONEDA;
						llave.DE_NUMERO_ORDEN = oModelJSON.getData()[i].DE_NUMERO_ORDEN;
						llave.DE_NUM_ACEPTACION = oModelJSON.getData()[i].DE_NUM_ACEPTACION;
						llave.DE_NUM_ARTICULO = oModelJSON.getData()[i].DE_NUM_ARTICULO;
						llave.DE_NUM_DOC_SAP = oModelJSON.getData()[i].DE_NUM_DOC_SAP;
						llave.DE_NUM_FACTURA = oModelJSON.getData()[i].DE_NUM_FACTURA;
						llave.DE_NUM_MATERIAL = oModelJSON.getData()[i].DE_NUM_MATERIAL;
						llave.DE_NUM_SERVICIO = oModelJSON.getData()[i].DE_NUM_SERVICIO;
						llave.DE_PEDIDO = oModelJSON.getData()[i].DE_PEDIDO;
						llave.DE_POSICION = oModelJSON.getData()[i].DE_POSICION;
						llave.DE_PRECIO = oModelJSON.getData()[i].DE_PRECIO;
						llave.DE_SITUACION1 = oModelJSON.getData()[i].DE_SITUACION1;
						llave.DE_SITUACION2 = oModelJSON.getData()[i].DE_SITUACION2;
						llave.DE_SUBTOTAL = oModelJSON.getData()[i].DE_SUBTOTAL;
						llave.DE_TIPO = oModelJSON.getData()[i].DE_TIPO;
						llave.DE_TOTAL = oModelJSON.getData()[i].DE_TOTAL;
						llave.DE_UND_MEDIDA = oModelJSON.getData()[i].DE_UND_MEDIDA;
						llave.DOC_PROVEEDOR = oModelJSON.getData()[i].DOC_PROVEEDOR;
						llave.LOTE = oModelJSON.getData()[i].LOTE;
						llave.NON_CENTRO = oModelJSON.getData()[i].NON_CENTRO;
						llave.NOTA_RECEPCION = oModelJSON.getData()[i].NOTA_RECEPCION;
						llave.NROSOLICITU = oModelJSON.getData()[i].NROSOLICITU;
						llave.NRO_CONTRATO = oModelJSON.getData()[i].NRO_CONTRATO;
						llave.RECEPTOR = oModelJSON.getData()[i].RECEPTOR;
						llave.REFERENCIA = oModelJSON.getData()[i].REFERENCIA;
						llave.SOLICITUDS = oModelJSON.getData()[i].SOLICITUDS;
						llave.UBICACION = oModelJSON.getData()[i].UBICACION;
						llave.USUARIO = oModelJSON.getData()[i].USUARIO;*/
						vector.push(llave);
					}

					oModelMyParam.setProperty("/listReporteValeDetalle", vector);
				}.bind(this),
				error: function (oError) {
				}.bind(this)
			});
		},

		formatTipoCarga: function (guia, centro, tipo) {
			if (tipo !== "" && tipo !== "M" && tipo !== null && tipo !== undefined) {
				if (tipo === "D" || tipo === "S") {
					return guia;
				} else {
					return centro;
				}
			} else {
				return "M-Miseláneos";
			}
		},

		formatTipoCargaAsignacion: function (flac) {

			if (flac === "") {
				return "img/BanderaVerde2.png";
			} else {
				return "img/BanderaAzul2.png";
			}
		},

		formatTipoCarga1: function (est) {
			if (est !== "" && est !== "M" && est !== null && est !== undefined) {
				if (est === "D" || est === "S") {
					return "Guía Remisión";
				} else {
					return "Centro";
				}
			} else {
				return "M-Miseláneos";
			}
		},
		formatEstadoFactura: function (est) {
			if (est !== "" && est !== null && est !== undefined) {
				if (est === "P") {
					return "Pre-registrado";
				} else if (est === "R") {
					return "Pre-registrado SAP";
				} else if (est === "C") {
					return "Contabilizado";
				} else {
					return "Otro estado";
				}
			} else {
				return "Sin estado";
			}
		},
		formatTipoCargaVisible: function (est) {
			if (est !== "" && est !== null && est !== undefined) {
				return true;
			} else {
				return false;
			}
		},
		descripcionProveedor: function (ruc) {
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			var todosEmpresa = oModel.getProperty("/listaProveedoresRUC");
			var descripcion = "";
			for (var i = 0; i < todosEmpresa.length; i++) {
				if (todosEmpresa[i].codigo === ruc) {
					descripcion = todosEmpresa[i].descripcion;
				}
			}
			return descripcion;
		},
		descripcionEmpresa: function (ruc) {
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			var todosEmpresa = oModel.getProperty("/listaEmpresasRUC");
			var descripcion = "";
			for (var i = 0; i < todosEmpresa.length; i++) {
				if (todosEmpresa[i].codigo === ruc) {
					descripcion = todosEmpresa[i].descripcion;
				}
			}
			return descripcion;
		},
		btnDescargarPDF: function () {

			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var varTblItemFacturasCabecera = oModel.getProperty("/listConsultaResumenFacturaCabecera");
			var varTblItemFacturasDetalle = oModel.getProperty("/listConsultaResumenFacturaDetalle");
			var fullHtml = "";
			if (varTblItemFacturasCabecera.TIPO === "D" || varTblItemFacturasCabecera.TIPO === "S") {
				var header = this.getHeaderForm(varTblItemFacturasCabecera, varTblItemFacturasDetalle);
			} else {
				var header = this.getHeaderForm2(varTblItemFacturasCabecera, varTblItemFacturasDetalle);
			}
			fullHtml += header;

			// window.open(URL, name, specs, replace)
			var wind = window.open("", "prntExample");
			wind.document.write(fullHtml);
			setTimeout(function () {
				wind.print();
				wind.close();
			}, 1000);
		},

		formatoFecha: function (fecha) {

			if (fecha.length === 8) {
				var varAno = fecha.substring(0, 4);
				var varMes = fecha.substring(4, 6);
				var varDia = fecha.substring(6, 8);

				var fechaNew = varAno + "-" + varMes + "-" + varDia;
			} else {
				var varAno = fecha.substring(0, 4);
				var varMes = fecha.substring(5, 7);
				var varDia = fecha.substring(8, 10);

				var fechaNew = varAno + "-" + varMes + "-" + varDia;
			}
			return fechaNew;
		},

		getHeaderForm: function (modelData, modelDataDet) {

			var varCENTROV = "";
			if (modelData.CENTROV === null || modelData.CENTROV === undefined) {
				varCENTROV = "";
			} else {
				varCENTROV = modelData.CENTROV;
			}

			var varCOMPRADORS = "";
			if (modelData.COMPRADORS === null) {
				varCOMPRADORS = "";
			} else {
				varCOMPRADORS = modelData.COMPRADORS;
			}

			var varREFERENCIA = "";
			if (modelData.REFERENCIA === null || modelData.REFERENCIA === undefined) {
				varREFERENCIA = "";
			} else {
				varREFERENCIA = modelData.REFERENCIA;
			}

			var varNON_CENTRO = "";
			if (modelData.NON_CENTRO === null || modelData.NON_CENTRO === undefined) {
				varNON_CENTRO = "";
			} else {
				varNON_CENTRO = modelData.NON_CENTRO;
			}

			var cadenaHTML = "<p>&nbsp;</p>" +
				"<p align='center'><strong>INGRESO DE ENTRADA DE MERCANCIAS</strong></p>" +
				"<p>&nbsp;</p>" +

				"<table>" +
				"<tbody>" +
				"<tr>" +
				"<td>" +
				"<div style='float:left;margin-left:25px;margin-right:50px;'>" +
				"<table>" +
				"<tbody>" +
				"<tr>" +
				"<td><b>Fecha de impresión: </b></td>" +
				"<td>" + modelData.FEC_RECEPCIONNEW + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Número: </b></td>" +
				"<td>" + modelData.DOC_MATERIAL + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Centro: </b></td>" +
				"<td>" + varCENTROV + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Proveedor: </b></td>" +
				"<td>" + modelData.US_RUC + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Comprador: </b></td>" +
				"<td>" + varCOMPRADORS + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Referencia: </b></td>" +
				"<td>" + varREFERENCIA + "</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</div>" +
				"</td>" +
				"<td>" +
				"<div style='float:right;margin-left:25px;margin-right:1px;'>" +
				"<table>" +
				"<tbody>" +
				"<tr>" +
				"<td><b>Fecha: </b></td>" +
				"<td>" + modelData.FEC_RECEPCIONNEW + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Orden Compra: </b></td>" +
				"<td>" + modelData.NUMERO_ORDEN + " / " + modelData.POSICION_ORDEN + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Denominación: </b></td>" +
				"<td>" + varNON_CENTRO + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Denominación: </b></td>" +
				"<td>" + this.descripcionProveedor(modelData.US_RUC) + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Guía de remisión: </b></td>" +
				"<td>" + modelData.GUIA_REMISION + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><p>&nbsp;</p></td>" +
				"<td><p>&nbsp;</p></td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</div>" +
				"</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +

				"<p>&nbsp;</p>" +
				"<table style='border:1px solid black;border-collapse:collapse;'>" +
				"<tbody>" +
				"<tr>" +
				"<td style='border:1px solid black;margin:7px;width:24px;'>" +
				"<p><strong>Nro</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:76px;'>" +
				"<p><strong>C&oacute;d. Material</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:188px;'>" +
				"<p><strong>Descripci&oacute;n</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:66px;'>" +
				"<p><strong>Lote</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:53px;'>" +
				"<p><strong>Almac&eacute;n</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:64px;'>" +
				"<p><strong>Ubicaci&oacute;n</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:57px;'>" +
				"<p><strong>Cantidad</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:37px;'>" +
				"<p><strong>UM</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:63px;'>" +
				"<p><strong>Nro Sol</strong></p>" +
				"</td>" +
				"<td style='border:1px solid black;margin:7px;width:126px;'>" +
				"<p><strong>Nota de Recepci&oacute;n</strong></p>" +
				"</td>" +
				"</tr>";

			for (var i = 0; i < modelDataDet.length; i++) {

				var varLOTE = "";
				if (modelDataDet[i].LOTE === null) {
					varLOTE = "";
				} else {
					varLOTE = modelDataDet[i].LOTE;
				}

				var varALMACEN = "";
				if (modelDataDet[i].ALMACEN === null) {
					varALMACEN = "";
				} else {
					varALMACEN = modelDataDet[i].ALMACEN;
				}

				var varUBICACION = "";
				if (modelDataDet[i].UBICACION === null) {
					varUBICACION = "";
				} else {
					varUBICACION = modelDataDet[i].UBICACION;
				}

				var varNROSOLICITU = "";
				if (modelDataDet[i].NROSOLICITU === null) {
					varNROSOLICITU = "";
				} else {
					varNROSOLICITU = modelDataDet[i].NROSOLICITU;
				}

				var varNOTA_RECEPCION = "";
				if (modelDataDet[i].NOTA_RECEPCION === null) {
					varNOTA_RECEPCION = "";
				} else {
					varNOTA_RECEPCION = modelDataDet[i].NOTA_RECEPCION;
				}

				cadenaHTML += "<tr>" +
					"<td style='border:1px solid black;margin:7px;width: 24px;'>" +
					"<p>" + modelDataDet[i].DE_POSICION + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:76px;'>" +
					"<p>" + modelDataDet[i].DE_DOC_MATERIAL + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:188px;'>" +
					"<p>" + modelDataDet[i].DE_DESCRIPCION + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:66px;'>" +
					"<p>" + varLOTE + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:53px;'>" +
					"<p>" + varALMACEN + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:64px;'>" +
					"<p>" + varUBICACION + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:57px;'>" +
					"<p>" + modelDataDet[i].DE_CANTIDAD + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:37px;'>" +
					"<p>" + modelDataDet[i].DE_MONEDA + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:63px;'>" +
					"<p>" + varNROSOLICITU + "</p>" +
					"</td>" +
					"<td style='border:1px solid black;margin:7px;width:126px;'>" +
					"<p>" + varNOTA_RECEPCION + "</p>" +
					"</td>" +
					"</tr>";

			}
			cadenaHTML += "</tbody>" +
				"</table>" +
				"<p>&nbsp;</p>" +
				"<p>&nbsp;</p>" +
				"<p></p>" +
				"<p>Emisor:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </u>&nbsp;&nbsp;&nbsp;&nbsp; V&deg;B&deg; Almac&eacute;n:&nbsp; &nbsp;<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </u>&nbsp;</p>" +
				"<p>Denominaci&oacute;n:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Proveedor:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </u></p>";
			return cadenaHTML;
			// "<hr/><div>" +
			// 	"<H1>Factura              : " + modelData.ID_FACTURA + "</H1>" +
			// 	"<p><H3>" + modelData.NOM_DEM_RAZ_ADQ + "</H3></p>" +
			// 	"<p><H2>" + modelData.NOM_COMERCIAL + "</H2></p>" +
			// 	"<div style=float:left>" +
			// 	"<p><b>RUC Proveedor          : </b>" + modelData.US_RUC + "</p>" +
			// 	"<p><b>Correlativo de factura : </b>" + modelData.CO_FACTURA + "</p>" + //CO_FACTURA
			// 	"<p><b>Estado                 : </b>" + this.formatEstadoFactura(modelData.ESTADO) + "</p>" +
			// 	"<p><b>Fecha de pre registro  : </b>" + modelData.FC_FEC_REGISTRO + "</p>" +
			// 	"<p><b>Hora de pre registro   : </b>" + modelData.FC_HORA_REGISTRO + "</p>" +
			// 	"</div><div style=float:right>" +
			// 	"<p><b>RUC Empresa            : </b>" + modelData.EM_RUC + "</p>" +
			// 	"<p><b>Carga                  : </b>" + this.formatTipoCarga(modelData.TIPO_CARGA) + "</p>" +
			// 	"<p><b>Total IGV              : </b>" + modelData.TOTAL_IGV + "</p>" +
			// 	"<p><b>Total Importe          : </b>" + modelData.TOTAL_IMP + "</p>" +
			// 	"<p><b>Version UBL          : </b>" + modelData.UBL + "</p>" +
			// 	"</div></div>";
		},
		getHeaderForm2: function (modelData, modelDataDet) {

			var oModel = this.getView().getModel("myParam");

			var usuarioLogin2 = oModel.getProperty("/usuarioLogin2");

			var varRUC = oModel.getProperty("/usuarioRuc").toString();

			/////////////// LOGO DEL REPORTE ////////////////
			var modulePath = "";
			var ancho = "";
			var altura = "";
			if (varRUC === "20131565659") { //LOGO_TALSA
				modulePath = "./img/LOGO_TALSA.jpg";
				ancho = "55.6";
				altura = "90.35";
			} else if (varRUC === "20373626466") { //LOGO_INVERSIO_ES_JORDIE
				modulePath = "./img/LOGO_INVERSIO_ES_JORDIE.jpg";
				ancho = "136.5";
				altura = "72.02";
			} else if (varRUC === "20480943687") { //logoAVO
				modulePath = "./img/logoAVO.jpg";
				ancho = "83.04";
				altura = "76.8";
			} else if (varRUC === "20540029041") { //
				modulePath = "";
				ancho = "0";
				altura = "0";
			} else if (varRUC === "20603635826") { //LOGO_Talsa_Agro_export
				modulePath = "./img/LOGO_Talsa_Agro_export.jpg";
				ancho = "125.8";
				altura = "77.76";
			}

			//var modulePath = "./img/logo.jpg";
			// var imgenFirma = "./img/firmaEjemplo.jpg";
			var imgenFirma = "";

			////////////////////////////// DE_DIRECCION ////////////////////////

			var varDE_DIRECCION = modelData.DIRECCION;
			//var varDE_DIRECCION = "Jose Villacorta|Supervisor|Administrativa";

			if (varDE_DIRECCION !== "" && varDE_DIRECCION !== null && varDE_DIRECCION !== undefined) {
				var vartxt1 = "";
				var vectortxt1 = [];
				var llavetxt1 = {};
				for (var k = 0; k < varDE_DIRECCION.length; k++) {
					if (varDE_DIRECCION.substring(k, k + 1) !== "|") {
						vartxt1 = vartxt1 + varDE_DIRECCION.substring(k, k + 1);
					}
					if (varDE_DIRECCION.substring(k, k + 1) === "|" || k === varDE_DIRECCION.length - 1) {
						llavetxt1 = {};
						llavetxt1.Dato = vartxt1;
						vectortxt1.push(llavetxt1);
						vartxt1 = "";
					}
				}

				var varNombre = vectortxt1[0].Dato;
				var varCargo = vectortxt1[1].Dato;
				var varArea = vectortxt1[2].Dato;
			}

			////////////////////////////////////////////////////////////////////

			////////////////////////////// USUARIO /////////////////////////////

			var varUSUARIO = modelData.USUARIO;
			//var varUSUARIO = "JVILLACORTA";

			if (varUSUARIO !== "" && varUSUARIO !== null && varUSUARIO !== undefined) {
				var varImagenFirma = this.getFirma(varUSUARIO);

				var varImagenFirmaEstruc = varImagenFirma[0].varLinkFirma;
				var varImagenFirmaAncho = varImagenFirma[0].ancho;
				var varImagenFirmaAltura = varImagenFirma[0].altura;
			}

			////////////////////////////////////////////////////////////////////

			var contenido = "<hr/><div>" +

				"<H3 align='center'><u>CONFORMIDAD DE SERVICIO (HES)</u></H3>" +

				"<table>" +
				"<tbody>" +
				"<tr>" +
				"<td>" +
				"<div style='float:left;margin-left:25px;margin-right:15px;'>" +
				"<Img src=" + modulePath + " width='" + ancho + "' height='" + altura + "'/>" +
				"<p></p>" +
				"<table>" +
				"<tbody>" +
				"<tr>" +
				"<td><b>Proveedor: </b></td>" +
				"<td>" + modelData.US_RUC + "-" + this.descripcionProveedor(modelData.US_RUC) + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>RUC: </b></td>" +
				"<td>" + modelData.EM_RUC + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Doc. Proveedor: </b></td>" +
				"<td>" + modelData.DOC_PROVEEDOR + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Usuario: </b></td>" +
				"<td>" + usuarioLogin2 + "</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</div>" +
				"</td>" +
				"<td>" +
				"<div style='float:right;margin-right:25px;'>" +
				"<table>" +
				"<tbody>" +
				"<tr>" +
				"<td><b>Fec. Recepción: </b></td>" +
				"<td>" + modelData.FEC_RECEPCION + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>N° Recepción: </b></td>" +
				"<td>" + modelData.HOJA_ENTRADA + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>N° Orden de Compra: </b></td>" +
				"<td>" + modelData.NUMERO_ORDEN + " / " + modelData.POSICION_ORDEN + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>N° Contrato: </b></td>" +
				"<td>" + modelData.NRO_CONTRATO + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Comprador: </b></td>" +
				"<td>" + modelData.COMPRADORS + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td><b>Centro: </b></td>" +
				"<td>" + modelData.CENTROS + "</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</div>" +
				"</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +

				"<p></p>" +
				"<p></p>" +
				"<div style='float:left;margin-left:50px;'>" +
				"<p>Doy conformidad que los trabajos solicitados fueron realizados:</p>" +
				"</div>" +

				"<p></p>" +
				"<div style='float:left;margin-left:25px;margin-right:25px;'>" +
				"<table style='width:700px;border:1px solid black;border-collapse:collapse;' align='center'>" +
				"<thead>" +
				"<tr>" +
				"<th style='border:1px solid black;'>" +
				"<h4>N°</h4>" +
				"</th>" +
				"<th style='border:1px solid black;'>" +
				"<h4>Servicio</h4>" +
				"</th>" +
				"<th style='border:1px solid black;'>" +
				"<h4>Descripción</h4>" +
				"</th>" +
				"<th style='border:1px solid black;'>" +
				"<h4>Cantidad</h4>" +
				"</th>" +
				"<th style='border:1px solid black;'>" +
				"<h4>UM</h4>" +
				"</th>" +
				"<th style='border:1px solid black;'>" +
				"<h4>Solicitud</h4>" +
				"</th>" +
				"</tr>" +
				"</thead>" +
				"<tbody>";
			for (var i = 0; i < modelDataDet.length; i++) {
				contenido += "<tr>" +
					"<td style='border:1px solid black;' align='center'>" + this.formatoNoNull(modelDataDet[i].DE_POS_DOC_MATERIAL) +
					"</td>" +
					"<td style='border:1px solid black;' align='center'>" + this.formatoNoNull(modelDataDet[i].DE_NUM_SERVICIO) + "</td>" +
					"<td style='border:1px solid black;' align='left'>" + this.formatoNoNull(modelDataDet[i].DE_DESCRIPCION) + "</td>" +
					"<td style='border:1px solid black;' align='center'>" + this.formatoNoNull(modelDataDet[i].DE_CANTIDAD) + "</td>" +
					"<td style='border:1px solid black;' align='center'>" + this.formatoNoNull(modelDataDet[i].DE_MONEDA) + "</td>" +
					"<td style='border:1px solid black;' align='center'>" + this.formatoNoNull(modelDataDet[i].SOLICITUDS) + "</td>" +
					"</tr>";
			}
			contenido += "</tbody>" +
				"</table>" +
				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"</div>" +

				"<div style='float:left;margin-left:25px;margin-right:25px;'>" +
				"<p>El cumplimiento del servicio ha sido evaluado de acuerdo a los requerimientos indicados en la Orden de Compra y/o el contrato, por el cual se adjunta esta Hoja de Conformidad a la factura/comprobante emitida por el proveedor.</p>" +
				"</div>" +

				"<div style='float:left;margin-left:70px;margin-right:25px;'>" +
				"<table style='border:1px solid black;border-collapse:collapse;'>" +
				"<tbody>" +
				"<td style='border:1px solid black;margin:7px;width:150px;' align='left'>Factura / RxH N°</td>" +
				"<td style='border:1px solid black;margin:7px;width:450px;' align='center'></td>" +
				"</tbody>" +
				"</table>" +
				"</div>" +

				"<div style='float:left;margin-left:25px;margin-right:25px;'>" +
				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"<table style='width:700px;border:1px solid black;border-collapse:collapse;'>" +
				"<tbody>" +
				"<td style='border:1px solid black;margin:3px;' align='left'>Observaciones: </td>" +
				"</tbody>" +
				"</table>" +
				"<p></p>" +
				"</div>" +

				"<div style='float:left;margin-left:25px;margin-right:25px;'>" +
				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"<table>" +
				"<tbody>" +
				"<tr>" +
				"<td>" +
				"<h4>Elaborado por:</h4>" +
				"<table style='width:300px;border:1px solid black;border-collapse:collapse;'>" +
				"<tbody>" +
				"<tr>" +
				"<td style='border:1px solid black;width:100px;height:60px;'>Firma:</td>" +
				"<td style='border:1px solid black;width:200px;'></td>" +
				"</tr>" +
				"<tr>" +
				"<td style='border:1px solid black;margin-bottom:60px;width:100px;'>Nombre:</td>" +
				"<td style='border:1px solid black;width:200px;'></td>" +
				"</tr>" +
				"<tr>" +
				"<td style='border:1px solid black;margin-bottom:60px;width:100px;'>Cargo:</td>" +
				"<td style='border:1px solid black;width:200px;'></td>" +
				"</tr>" +
				"<tr>" +
				"<td style='border:1px solid black;margin-bottom:60px;width:100px;'>Área:</td>" +
				"<td style='border:1px solid black;width:200px;'></td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</td>" +
				"<td>" +
				"<h4 style='margin-left:30px;'>Aprobado por:</h4>" +
				"<table style='width:300px;border:1px solid black;border-collapse:collapse;margin-left:30px;'>" +
				"<tbody>" +
				"<tr>" +
				"<td style='border:1px solid black;width:100px;height:60px;'>Firma:</td>" +
				"<td style='border:1px solid black;width:200px;' align='center'>" +
				"<Img src=" + varImagenFirmaEstruc + " width='" + varImagenFirmaAncho + "px' height='" + varImagenFirmaAltura + "px'/>" +
				"</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='border:1px solid black;margin-bottom:60px;width:100px;'>Nombre:</td>" +
				"<td style='border:1px solid black;width:200px;'>" + varNombre + "</td>" +
				//"<td style='border:1px solid black;width:200px;'>Luis Suyo</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='border:1px solid black;margin-bottom:60px;width:100px;'>Cargo:</td>" +
				"<td style='border:1px solid black;width:200px;'>" + varCargo + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='border:1px solid black;margin-bottom:60px;width:100px;'>Área:</td>" +
				"<td style='border:1px solid black;width:200px;'>" + varArea + "</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"<p></p>" +
				"</div>" +

				"<div style='float:left;margin-left:25px;margin-right:25px;'>" +
				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"<table>" +
				"<tbody>" +
				"<tr>" +
				"<td>" +
				"<h4>Entregado por:</h4>" +
				"<table style='width:500px;border:1px solid black;border-collapse:collapse;'>" +
				"<tbody>" +
				"<tr>" +
				"<td style='border:1px solid black;width:150px;height:60px;'>Firma:</td>" +
				"<td style='border:1px solid black;width:350px;'></td>" +
				"</tr>" +
				"<tr>" +
				"<td style='border:1px solid black;margin-bottom:60px;width:150px;'>Nombre:</td>" +
				"<td style='border:1px solid black;width:350px;'></td>" +
				"</tr>" +
				"<tr>" +
				"<td style='border:1px solid black;margin-bottom:60px;width:150px;'>Cargo:</td>" +
				"<td style='border:1px solid black;width:350px;'></td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</div>" +

				"</div>";

			return contenido;
		},

		formatoNoNull: function (dato) {

			if (dato !== null && dato !== undefined && dato !== "") {
				return dato;
			} else {
				return " ";
			}
		},

		getDataOrdenCompra: function () {

			//var url = "/public/proveedores/tablap.xsodata";
			var url = "" + this.varTableURL + "";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);

			var oThis = this;
			var oModel2 = oThis.getView().getModel("myParam");
			var usuarioRuc = oModel2.getProperty("/usuarioRuc");
			var usuarioLogin = oModel2.getProperty("/usuarioLogin");
			var varNumOrden = oModel2.getProperty("/listConsultaResumenFacturaCabecera/NUMERO_ORDEN");

			oModel2.setProperty("/listFirmaElab", []);
			oModel2.setProperty("/listFirmaAcep", []);

			// Mostrar JSON Cabecera
			var filtersC = [];
			var filterC;
			filterC = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, usuarioRuc);
			filtersC.push(filterC);
			filterC = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
			filtersC.push(filterC);
			filterC = new sap.ui.model.Filter("OC_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, varNumOrden);
			filtersC.push(filterC);

			//oModel.read("/T_ORD?$format=json", {
			oModel.read("/" + this.varTableT_ORD + "?$format=json", {
				filters: filtersC,
				success: function (responseC) {

					// Cabecera
					var oModelJSONC = new sap.ui.model.json.JSONModel(responseC.results);
					var tamTablaC = oModelJSONC.getData().length;
					var vectorC = [];
					var llaveC = {};

					for (var i = 0; i < tamTablaC; i++) {
						llaveC = {};
						llaveC.EM_RUC = oModelJSONC.getData()[i].EM_RUC;
						llaveC.US_RUC = oModelJSONC.getData()[i].US_RUC;
						llaveC.OC_NUMERO_ORDEN = oModelJSONC.getData()[i].OC_NUMERO_ORDEN;
						llaveC.EM_NOMBRE = oModelJSONC.getData()[i].EM_NOMBRE;
						//llaveC.EM_NOMBRE = "TEST RIVERCON S.A.";
						llaveC.EM_DIRECCION = oModelJSONC.getData()[i].EM_DIRECCION;
						llaveC.EM_TELEFONO = oModelJSONC.getData()[i].EM_TELEFONO;
						llaveC.OC_FECHA = oModelJSONC.getData()[i].OC_FECHA;
						llaveC.US_NOMBRE = oModelJSONC.getData()[i].US_NOMBRE;
						llaveC.US_DIRECCION = oModelJSONC.getData()[i].US_DIRECCION;
						llaveC.OC_MONEDA = oModelJSONC.getData()[i].OC_MONEDA;
						llaveC.OC_LUG_ENTREGA = oModelJSONC.getData()[i].OC_LUG_ENTREGA;
						llaveC.OC_COND_PAGO = oModelJSONC.getData()[i].OC_COND_PAGO;
						llaveC.OC_VALOR_NETO = oModelJSONC.getData()[i].OC_VALOR_NETO;
						llaveC.OC_VALOR_IGV = oModelJSONC.getData()[i].OC_VALOR_IGV;
						llaveC.OC_TASA_IGV = oModelJSONC.getData()[i].OC_TASA_IGV;
						llaveC.OC_VALOR_TOTAL = oModelJSONC.getData()[i].OC_VALOR_TOTAL;
						llaveC.OC_COD_ELAB = oModelJSONC.getData()[i].OC_COD_ELAB;
						var varFirmaElab = "";
						if (llaveC.OC_COD_ELAB === "" || llaveC.OC_COD_ELAB === undefined || llaveC.OC_COD_ELAB === null) {
							varFirmaElab = "";
						} else {
							varFirmaElab = this.getFirma(llaveC.OC_COD_ELAB);
						}
						llaveC.OC_ELABORADO = oModelJSONC.getData()[i].OC_ELABORADO;
						llaveC.OC_TELE_ELAB = oModelJSONC.getData()[i].OC_TELE_ELAB;
						llaveC.OC_MAIL_ELAB = oModelJSONC.getData()[i].OC_MAIL_ELAB;
						llaveC.OC_COD_ACEP = oModelJSONC.getData()[i].OC_COD_ACEP;
						var varFirmaAcep = "";
						if (llaveC.OC_COD_ACEP === "" || llaveC.OC_COD_ACEP === undefined || llaveC.OC_COD_ACEP === null) {
							varFirmaAcep = "";
						} else {
							varFirmaAcep = this.getFirma(llaveC.OC_COD_ACEP);
						}
						llaveC.OC_ACEPTADO = oModelJSONC.getData()[i].OC_ACEPTADO;
						llaveC.OC_INCOTERM = oModelJSONC.getData()[i].OC_INCOTERM;
						llaveC.OC_LUGAR_INCOT = oModelJSONC.getData()[i].OC_LUGAR_INCOT;
						vectorC.push(llaveC);
					}
					oModel2.setProperty("/listCabOrdenCompra", vectorC);
					oModel2.setProperty("/listFirmaElab", varFirmaElab);
					oModel2.setProperty("/listFirmaAcep", varFirmaAcep);

					// Detalle
					// Mostrar JSON Cabecera
					var filtersD = [];
					var filterD;
					filterD = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, usuarioRuc);
					filtersD.push(filterD);
					filterD = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
					filtersD.push(filterD);
					filterD = new sap.ui.model.Filter("OC_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, varNumOrden);
					filtersD.push(filterD);

					//oModel.read("/T_ORD_DET?$format=json", {
					oModel.read("/" + this.varTableT_ORD_DET + "?$format=json", {
						filters: filtersD,
						success: function (responseD) {

							var oModelJSOND = new sap.ui.model.json.JSONModel(responseD.results);
							var tamTablaD = oModelJSOND.getData().length;
							var vectorD = [];
							var llaveD = {};

							for (var i = 0; i < tamTablaD; i++) {
								llaveD = {};
								llaveD.EM_RUC = oModelJSOND.getData()[i].EM_RUC;
								llaveD.US_RUC = oModelJSOND.getData()[i].US_RUC;
								llaveD.OC_NUMERO_ORDEN = oModelJSOND.getData()[i].OC_NUMERO_ORDEN;
								llaveD.DE_POSICION_ORDEN = oModelJSOND.getData()[i].DE_POSICION_ORDEN;
								llaveD.DE_CODIGO = oModelJSOND.getData()[i].DE_CODIGO;
								llaveD.DE_DESCRIPCION = oModelJSOND.getData()[i].DE_DESCRIPCION;
								llaveD.DE_ALMACEN = oModelJSOND.getData()[i].DE_ALMACEN;
								llaveD.DE_NRO_SOLPED = oModelJSOND.getData()[i].DE_NRO_SOLPED;
								llaveD.DE_FEC_ENTREGA = oModelJSOND.getData()[i].DE_FEC_ENTREGA;
								llaveD.DE_CANTIDAD = oModelJSOND.getData()[i].DE_CANTIDAD;
								llaveD.DE_UNIDAD_MEDIDA = oModelJSOND.getData()[i].DE_UNIDAD_MEDIDA;
								llaveD.DE_PRECIO_UNITARIO = oModelJSOND.getData()[i].DE_PRECIO_UNITARIO;
								llaveD.DE_PRECIO_TOTAL = oModelJSOND.getData()[i].DE_PRECIO_TOTAL;
								vectorD.push(llaveD);
							}
							oModel2.setProperty("/listDetOrdenCompra", vectorD);
						}.bind(this),
						error: function (oError) {
						}.bind(this)
					});

					this.imprimirPdfOrdenCompra(varFirmaElab, varFirmaAcep);

				}.bind(this),
				error: function (oError) {
				}.bind(this)
			});
		},

		getFirma: function (codigo) {

			var vector = [];
			var llave = {};

			if (codigo === "JVILLACORTA") {
				llave = {};
				llave.varLinkFirma = "./firmas/Jose_V.jpg";
				llave.ancho = "66.72";
				llave.altura = "63.84";
			} else if (codigo === "MLOPEZ") {
				llave = {};
				llave.varLinkFirma = "./firmas/FIRMA_MARTIN_LOPEZ.jpg";
				llave.ancho = "11.36";
				llave.altura = "48.48";
			} else if (codigo === "HCASTILLO") {
				llave = {};
				llave.varLinkFirma = "./firmas/FIRMA_HILVIO_CASTILLO.jpg";
				llave.ancho = "104.4";
				llave.altura = "66.8";
			} else if (codigo === "JMEJIA") {
				llave = {};
				llave.varLinkFirma = "./firmas/FIRMA_JOHANA_MEJIA.jpg";
				llave.ancho = "111.09";
				llave.altura = "64.17";
			} else if (codigo === "FVILLANUEVA") {
				llave = {};
				llave.varLinkFirma = "./firmas/Fanny.jpg";
				llave.ancho = "137.16";
				llave.altura = "70.2";
			} else if (codigo === "LZECEVIC") {
				llave = {};
				llave.varLinkFirma = "./firmas/Lucas2.jpg";
				llave.ancho = "219.06";
				llave.altura = "114.48";
			} else if (codigo === "LVARGAS") {
				llave = {};
				llave.varLinkFirma = "./firmas/Laura.jpg";
				llave.ancho = "96";
				llave.altura = "128";
			}
			vector.push(llave);

			return vector;
		},

		btnDescargarPedido: function () {

			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var dataFirmaElab = oModel.getProperty("/listFirmaElab");
			var dataFirmaAcep = oModel.getProperty("/listFirmaAcep");

			var fullHtml = "";
			var header = this.imprimirPdfOrdenCompra(dataFirmaElab, dataFirmaAcep);
			fullHtml += header;

			// window.open(URL, name, specs, replace)
			var wind = window.open("", "prntExample");
			wind.document.write(fullHtml);
			setTimeout(function () {
				wind.print();
				wind.close();
			}, 1000);
		},

		imprimirPdfOrdenCompra: function (dataFirmaElab, dataFirmaAcep) {

			var oThis = this;
			var oModel2 = oThis.getView().getModel("myParam");
			var url = "http://www.ejemplo.com";

			// Cabecera
			var EM_NOMBRE = oModel2.getProperty("/listCabOrdenCompra/0/EM_NOMBRE");
			var EM_DIRECCION = oModel2.getProperty("/listCabOrdenCompra/0/EM_DIRECCION");
			var EM_TELEFONO = oModel2.getProperty("/listCabOrdenCompra/0/EM_TELEFONO");
			var US_RUC = oModel2.getProperty("/listCabOrdenCompra/0/US_RUC");
			var OC_NUMERO_ORDEN = oModel2.getProperty("/listCabOrdenCompra/0/OC_NUMERO_ORDEN");

			var OC_FECHA = oModel2.getProperty("/listCabOrdenCompra/0/OC_FECHA");
			var US_NOMBRE = oModel2.getProperty("/listCabOrdenCompra/0/US_NOMBRE");
			var EM_RUC = oModel2.getProperty("/listCabOrdenCompra/0/EM_RUC");
			var US_DIRECCION = oModel2.getProperty("/listCabOrdenCompra/0/US_DIRECCION");
			var OC_MONEDA = oModel2.getProperty("/listCabOrdenCompra/0/OC_MONEDA");
			var OC_COND_PAGO = oModel2.getProperty("/listCabOrdenCompra/0/OC_COND_PAGO");
			var OC_LUG_ENTREGA = oModel2.getProperty("/listCabOrdenCompra/0/OC_LUG_ENTREGA");

			var OC_VALOR_NETO = parseFloat(oModel2.getProperty("/listCabOrdenCompra/0/OC_VALOR_NETO"), 10).toFixed(2);
			//var OC_VALOR_IGV = parseFloat(oModel2.getProperty("/listCabOrdenCompra/0/OC_VALOR_IGV"), 10).toFixed(2);
			var OC_TASA_IGV = parseInt(oModel2.getProperty("/listCabOrdenCompra/0/OC_TASA_IGV"), 10).toFixed(2);
			if (OC_TASA_IGV === "" || OC_TASA_IGV === undefined || OC_TASA_IGV === null) {
				OC_TASA_IGV = "0.00";
			} else {
				OC_TASA_IGV = parseInt(oModel2.getProperty("/listCabOrdenCompra/0/OC_TASA_IGV"), 10).toFixed(2);
			}
			var OC_VALOR_TOTAL = parseFloat(oModel2.getProperty("/listCabOrdenCompra/0/OC_VALOR_TOTAL"), 10).toFixed(2);
			var OC_VALOR_IGV = parseFloat(oModel2.getProperty("/listCabOrdenCompra/0/OC_VALOR_TOTAL"), 10) - parseFloat(oModel2.getProperty(
				"/listCabOrdenCompra/0/OC_VALOR_NETO"), 10);
			OC_VALOR_IGV = OC_VALOR_IGV.toFixed(2);

			var OC_ELABORADO = oModel2.getProperty("/listCabOrdenCompra/0/OC_ELABORADO");
			var OC_ACEPTADO = oModel2.getProperty("/listCabOrdenCompra/0/OC_ACEPTADO");

			var OC_TELE_ELAB = oModel2.getProperty("/listCabOrdenCompra/0/OC_TELE_ELAB");
			var OC_MAIL_ELAB = oModel2.getProperty("/listCabOrdenCompra/0/OC_MAIL_ELAB");

			//var linkFirmaElab = dataFirmaElab[0].varLinkFirma;
			//var anchoFirmaElab = dataFirmaElab[0].ancho;
			//var alturaFirmaElab = dataFirmaElab[0].altura;

			//var linkFirmaAcep = dataFirmaAcep[0].varLinkFirma;
			//var anchoFirmaAcep = dataFirmaAcep[0].ancho;
			//var alturaFirmaAcep = dataFirmaAcep[0].altura;

			// Detalle
			var varTablaDetalle = oModel2.getProperty("/listDetOrdenCompra");
			var varTamTablaDetalle = oModel2.getProperty("/listDetOrdenCompra").length;
			if (varTamTablaDetalle !== null && varTamTablaDetalle !== undefined && varTamTablaDetalle !== 0) {
				varTamTablaDetalle = oModel2.getProperty("/listDetOrdenCompra").length;
			} else {
				varTamTablaDetalle = 0;
			}

			var contenido = "<hr/><div>" +

				"<table style='width:700px;'>" +
				"<tbody>" +
				"<tr>" +
				"<td style='width:90px;' align='center'>" +
				//"<Img src=" + modulePath + " width='85px' height='135px'/>" +
				"</td>" +
				"<td style='width:350px;' align='left'>" +
				"<p style='font-size: 10px;'><b><h2>" + EM_NOMBRE + "</h2></b></p>" +
				//"<p style='font-size: 10px;'>" + EM_DIRECCION + "</p>" +
				"<p style='font-size: 10px;'>Av. Primavera 3012</p>" +
				"<p style='font-size: 10px;'>" + EM_TELEFONO + "</p>" +
				"<p></p>" +
				"<p style='font-size: 10px;'>Punto de emisión</p>" +
				"</td>" +
				"<td>" +
				"<table style='width:220px;border:1px solid black;border-collapse:collapse;'>" +
				"<tbody>" +
				"<tr>" +
				"<td align='center'>" +
				"<p style='font-size: 12px;margin-top:20px;'>R.U.C. N° " + EM_RUC + "</p>" +
				"<p></p>" +
				"<p style='font-size: 12px;'>ORDEN DE COMPRA</p>" +
				"<p></p>" +
				"<p style='font-size: 12px;margin-bottom:20px;'>N°" + OC_NUMERO_ORDEN + "</p>" +
				"</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +
				"</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +

				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"<table style='width:700px;'>" +
				"<tbody>" +
				"<tr>" +
				"<td style='font-size: 12px;margin-right:20px;'><b>Fecha:</b></td>" +
				"<td style='font-size: 12px;margin-right:20px;'>" + OC_FECHA + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='font-size: 12px;margin-right:20px;'><b>Señores:</b></td>" +
				"<td style='font-size: 12px;margin-right:20px;'>" + US_NOMBRE + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='font-size: 12px;margin-right:20px;'><b>RUC:</b></td>" +
				"<td style='font-size: 12px;margin-right:20px;'>" + US_RUC + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='font-size: 12px;margin-right:20px;'><b>Dirección:</b></td>" +
				"<td style='font-size: 12px;margin-right:20px;'>" + US_DIRECCION + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='font-size: 12px;margin-right:20px;'><b>Moneda:</b></td>" +
				"<td style='font-size: 12px;margin-right:20px;'>" + OC_MONEDA + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='font-size: 12px;margin-right:20px;'><b>Condiciones de Pago:</b></td>" +
				"<td style='font-size: 12px;margin-right:20px;'>" + OC_COND_PAGO + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='font-size: 12px;margin-right:20px;'><b>Lugar de entrega:</b></td>" +
				"<td style='font-size: 12px;margin-right:20px;'>" + OC_LUG_ENTREGA + "</td>" +
				"</tr>" +
				"<tr>" +
				"<td style='font-size: 12px;margin-right:20px;'><b>Observaciones:</b></td>" +
				"<td style='font-size: 12px;margin-right:20px;'>" + "-----" + "</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +

				"<p></p>" +
				"<p></p>" +
				"<p></p>" +
				"<table style='width:700px;border:1px solid black;border-collapse:collapse;'>" +
				"<thead>" +
				"<tr>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>Pos</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>Código</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>Descripción</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>Alm</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>N° Solped</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>Fec. Entr.</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>Cantidad</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>U.M.</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>Costo unitario</b></p>" +
				"</th>" +
				"<th style='border:1px solid black;' align='center'>" +
				"<p style='font-size: 12px;'><b>Importe</b></p>" +
				"</th>" +
				"</tr>" +
				"</thead>" +
				"<tbody>";
			for (var i = 0; i < varTablaDetalle.length; i++) {
				contenido += "<tr>" +
					"<td style='font-size: 10px;' align='center'>" + oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_POSICION_ORDEN").toString() +
					"</td>" +
					"<td style='font-size: 10px;' align='center'>" + oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_CODIGO").toString() +
					"</td>" +
					"<td style='font-size: 10px;' align='left'>" + oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_DESCRIPCION").toString() +
					"</td>" +
					"<td style='font-size: 10px;' align='center'>" + oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_ALMACEN").toString() +
					"</td>" +
					"<td style='font-size: 10px;' align='center'>" + oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_NRO_SOLPED").toString() +
					"</td>" +
					"<td style='font-size: 10px;' align='center'>" + oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_FEC_ENTREGA").toString() +
					"</td>" +
					"<td style='font-size: 10px;' align='center'>" + oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_CANTIDAD").toString() +
					"</td>" +
					"<td style='font-size: 10px;;' align='center'>" + oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_UNIDAD_MEDIDA").toString() +
					"</td>" +
					"<td style='font-size: 10px;' align='center'>" + parseFloat(oModel2.getProperty("/listDetOrdenCompra/" + i +
						"/DE_PRECIO_UNITARIO"), 10).toFixed(2).toString() + "</td>" +
					"<td style='font-size: 10px;' align='center'>" + parseFloat(oModel2.getProperty("/listDetOrdenCompra/" + i + "/DE_PRECIO_TOTAL"),
						10).toFixed(2).toString() + "</td>" +
					"</tr>";
			}
			contenido += "</tbody>" +
				"</tbody>" +
				"</table>" +

				"<p></p>" +
				"<table style='float:right;width:300px;border:1px solid black;border-collapse:collapse;margin:10px;'>" +
				"<tbody>" +
				"<tr>" +
				"<td style='font-size: 10px;border:1px solid black;' align='center'><b>Valor neto</b></td>" +
				"<td style='font-size: 10px;border:1px solid black;' align='center'><b>IGV</b></td>" +
				"<td style='font-size: 10px;border:1px solid black;' align='center'><b>%</b></td>" +
				"<td style='font-size: 10px;border:1px solid black;' align='center'><b>TOTAL</b></td>" +
				"</tr>" +
				"<tr>" +
				"<td style='font-size: 10px;border:1px solid black;' align='center'>" + OC_VALOR_NETO + "</td>" +
				"<td style='font-size: 10px;border:1px solid black;' align='center'>" + OC_VALOR_IGV + "</td>" +
				"<td style='font-size: 10px;border:1px solid black;' align='center'>" + OC_TASA_IGV + "</td>" +
				"<td style='font-size: 10px;border:1px solid black;' align='center'>" + OC_VALOR_TOTAL + "</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +

				"<table style='width:700px;'>" +
				"<tbody>" +
				"<tr>" +
				"<td>" +
				"</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +

				"<p>&nbsp;</p>" +
				"<p>&nbsp;</p>" +
				"<p>&nbsp;</p>" +
				"<table align='center'>" +
				"<tbody>" +
				"<tr>" +
				"<td style='font-size: 12px;' align='center'>" +
				//"<Img src=" + linkFirmaElab + " width='" + anchoFirmaElab + "px' height='" + alturaFirmaElab + "px'/>" +
				"<p>___________________________</p>" +
				"<p>Elaborado por: " + OC_ELABORADO + "</p>" +
				//"<p>Elaborado por: Luis Suyo</p>" +
				"</td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'>" +
				"<p>&nbsp;</p>" +
				"<p>&nbsp;</p>" +
				"<p>&nbsp;</p>" +
				"<p>&nbsp;</p>" +
				"<p>&nbsp;</p>" +
				"<p>Contacto</p>" +
				"<p>__________________________</p>" +
				"<p align='left'>RPC: " + OC_TELE_ELAB + "</p>" +
				"<p align='left'>MAIL: " + OC_MAIL_ELAB + "</p>" +
				//"<p align='left'>MAIL: lsuyo@gmail.com</p>" +
				"</td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'><p>&nbsp;</p></td>" +
				"<td style='font-size: 12px;' align='center'>" +
				//"<Img src=" + linkFirmaAcep + " width='" + anchoFirmaAcep + "px' height='" + alturaFirmaAcep + "px'/>" +
				"<p>__________________________</p>" +
				"<p>Aprobado por: " + OC_ACEPTADO + "</p>" +
				//"<p>Aprobado por: Mauro Miche</p>" +
				"</td>" +
				"</tr>" +
				"</tbody>" +
				"</table>" +

				"<p></p>" +
				"<p style='font-size: 12px;' align='center'><b>Términos y condiciones de la O/C en el siguiente enlace: </b><a href='" + url +
				"'>" + url + "</a></p>" +

				"</div>";

			return contenido;
		},

		btnResponsableOrd: function () {

			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);

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

			var oDialog = new sap.m.Dialog({
				icon: 'sap-icon://key-user-settings',
				title: "Solicitar información de Orden de compra",
				resizable: true,
				draggable: true,
				contentWidth: "auto",
				type: "Message",
				content: [
					new sap.m.Label({
						text: "Por favor ingresar el número de orden de compra a consultar",
						width: "100%"
					}),
					new sap.m.ToolbarSpacer({}),
					new sap.m.Input({
						id: "idResOrdenCompra",
						type: "Text",
						editable: true,
						maxLength: 10,
						placeholder: "Número de orden de compra",
						width: "100%",
						value: "",
						liveChange: function (evt) {

							var varNoPermitido = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ,.{}´+-_;:[]¨*'¿?¡|°¬#$%&/()<>";
							var varTexto = sap.ui.getCore().byId("idResOrdenCompra").getValue();
							var cont = 0;
							for (var i = 0; i < varTexto.length; i++) {
								for (var j = 0; j < varNoPermitido.length; j++) {
									if (varTexto.substring(i, i + 1) === varNoPermitido.substring(j, j + 1)) {
										cont++;
									}
								}
							}

							if (cont !== 0) {
								varTexto = varTexto.substring(0, varTexto.length - 1);
							}

							if (varTexto.length === 10) {
								sap.ui.getCore().byId("idContinuar").setEnabled(true);
								sap.ui.getCore().byId("idResOrdenCompra").setValueState("None");
								sap.ui.getCore().byId("idResOrdenCompra").setValueStateText("");
							} else {
								sap.ui.getCore().byId("idContinuar").setEnabled(false);
								sap.ui.getCore().byId("idResOrdenCompra").setValueState("Warning");
								sap.ui.getCore().byId("idResOrdenCompra").setValueStateText("Valor numérico, tamaño 10");
							}


							sap.ui.getCore().byId("idResOrdenCompra").setValue(varTexto);
						}
					})
				],
				beginButton: new sap.m.Button("idContinuar", {
					text: 'Continuar',
					icon: 'sap-icon://open-command-field',
					enabled: false,
					press: function () {
						var var_EM_RUC = oModel.getProperty("/usuarioRuc");
						var var_US_RUC = oModel.getProperty("/usuarioLogin");
						var var_OC_NUMERO_ORDEN = sap.ui.getCore().byId("idResOrdenCompra").getValue();
						var var_CORREO_USU = this.varCorreoUsuarioGlobal;
						var var_FECHA_REGISTRO = date;
						var var_HORA_REGISTRO = time;
						var var_ESTADO = "0";


						var filters = [];
						var filter;
						filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, var_EM_RUC);
						filters.push(filter);
						filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, var_US_RUC);
						filters.push(filter);
						filter = new sap.ui.model.Filter("OC_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, var_OC_NUMERO_ORDEN);
						filters.push(filter);

						oModelJson.read("/" + this.varTableT_RESP_ORDEN + "?$format=json", {
							filters: filters,
							success: function (response) {
								var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
								var lenghtV = oModelJSON.getData().length;

								if (lenghtV !== 0) {
									if (oModelJSON.getData()[0].ESTADO === "0") {
										var dialogMessage = new sap.m.Dialog({
											title: "Mensaje",
											type: "Message",
											state: "Warning",
											icon: "sap-icon://accept",
											content: new sap.m.Text({
												text: "La información de la persona a contactar para ver el estado de la orden de compra, ya fue enviada a su correo electrónico. Por favor espere unos minutos."
											}),
											beginButton: new sap.m.Button({
												text: "Aceptar",
												press: function () {
													dialogMessage.close();
													dialogMessage.destroy();
												}.bind(this)
											}),
											afterClose: function () {
												dialogMessage.destroy();
											}
										});
										dialogMessage.open();
									} else {
										if (oModelJSON.getData()[0].NAME !== "") {
											if (oModelJSON.getData()[0].TELEFONO !== "" || oModelJSON.getData()[0].CORREO !== "") {
												this.dialogResInfoOrdenCompra(oModelJSON.getData()[0].OC_NUMERO_ORDEN, oModelJSON.getData()[0].NAME, oModelJSON.getData()[
													0].CORREO, oModelJSON.getData()[0].TELEFONO);
											} else {
												var llaveActualizar = {};
												llaveActualizar.ESTADO = "0";

												var texto = "/" + this.varTableT_RESP_ORDEN +
													"(EM_RUC='" + var_EM_RUC +
													"',US_RUC='" + var_US_RUC +
													"',OC_NUMERO_ORDEN='" + var_OC_NUMERO_ORDEN + "')";

												oModelJson.update(texto, llaveActualizar, {
													method: "PUT",
													success: function (data) {

														var dialogMessage = new sap.m.Dialog({
															title: "Mensaje",
															type: "Message",
															state: "Success",
															icon: "sap-icon://accept",
															content: new sap.m.Text({
																text: "Se registró su petición, en breve recibirá un correo electrónico con la información de la persona a contactar."
															}),
															beginButton: new sap.m.Button({
																text: "Aceptar",
																press: function () {
																	dialogMessage.close();
																	dialogMessage.destroy();
																}.bind(this)
															}),
															afterClose: function () {
																dialogMessage.destroy();
															}
														});
														dialogMessage.open();
													},
													error: function (data) {
													}
												});
											}
										} else {
											if (oModelJSON.getData()[0].TELEFONO !== "" || oModelJSON.getData()[0].CORREO !== "") {
												this.dialogResInfoOrdenCompra(oModelJSON.getData()[0].OC_NUMERO_ORDEN, oModelJSON.getData()[0].NAME, oModelJSON.getData()[
													0].CORREO, oModelJSON.getData()[0].TELEFONO);
											} else {
												var llaveActualizar = {};
												llaveActualizar.ESTADO = "0";

												var texto = "/" + this.varTableT_RESP_ORDEN +
													"(EM_RUC='" + var_EM_RUC +
													"',US_RUC='" + var_US_RUC +
													"',OC_NUMERO_ORDEN='" + var_OC_NUMERO_ORDEN + "')";

												oModelJson.update(texto, llaveActualizar, {
													method: "PUT",
													success: function (data) {

														var dialogMessage = new sap.m.Dialog({
															title: "Mensaje",
															type: "Message",
															state: "Success",
															icon: "sap-icon://accept",
															content: new sap.m.Text({
																text: "Se registró su petición, en breve recibirá un correo electrónico con la información de la persona a contactar."
															}),
															beginButton: new sap.m.Button({
																text: "Aceptar",
																press: function () {
																	dialogMessage.close();
																	dialogMessage.destroy();
																}.bind(this)
															}),
															afterClose: function () {
																dialogMessage.destroy();
															}
														});
														dialogMessage.open();
													},
													error: function (data) {
													}
												});
											}
										}
									}
								} else {
									var SOHeader = {};
									SOHeader.EM_RUC = var_EM_RUC;
									SOHeader.US_RUC = var_US_RUC;
									SOHeader.OC_NUMERO_ORDEN = var_OC_NUMERO_ORDEN;
									SOHeader.CHAR_1 = var_CORREO_USU;
									SOHeader.FECHA_REGISTRO = var_FECHA_REGISTRO;
									SOHeader.HORA_REGISTRO = var_HORA_REGISTRO;
									SOHeader.NAME = "";
									SOHeader.TELEFONO = "";
									SOHeader.CORREO = "";
									oModelJson.create("/" + this.varTableT_RESP_ORDEN + "", SOHeader, {
										method: "POST",
										success: function (data) {
											var dialogMessage = new sap.m.Dialog({
												title: "Mensaje",
												type: "Message",
												state: "Success",
												icon: "sap-icon://accept",
												content: new sap.m.Text({
													text: "Se registró su petición, en breve recibirá un correo electrónico con la información de la persona a contactar."
												}),
												beginButton: new sap.m.Button({
													text: "Aceptar",
													press: function () {
														dialogMessage.close();
														dialogMessage.destroy();
													}.bind(this)
												}),
												afterClose: function () {
													dialogMessage.destroy();
												}
											});
											dialogMessage.open();
										}.bind(this),
										error: function (data) {
										}.bind(this)
									});
								}

							}.bind(this),
							error: function (oError) {
							}.bind(this)
						});

						oDialog.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: 'sap-icon://sys-cancel',
					press: function () {
						oDialog.close();
						oDialog.destroy();
					}.bind(this)
				}),
				afterClose: function () {
					oDialog.destroy();
				},
			});
			oDialog.open();
		},

		dialogResInfoOrdenCompra: function (varOrden, varNombre, varCorreo, varTelefono) {

			var oDialog = new sap.m.Dialog({
				icon: 'sap-icon://key-user-settings',
				title: "Información de orden de compra: " + varOrden,
				resizable: true,
				draggable: true,
				contentWidth: "500px",
				type: "Message",
				content: [
					new sap.m.Label({
						text: "Por favor comunicarse con:",
						width: "100%"
					}),
					new sap.m.ToolbarSpacer({}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					/*new sap.m.Label({
						text: "Nombre:",
						width: "25%"
					}),*/
					new sap.ui.core.Icon({
						src: "sap-icon://employee",
						tooltip: "Nombre",
						width: "10%"
					}).addStyleClass("styleIcon"),
					new sap.m.Input({
						id: "idResOrdenCompraNombre",
						type: "Text",
						editable: false,
						width: "90%",
						value: varNombre
					}),
					new sap.m.ToolbarSpacer({}),
					/*new sap.m.Label({
						text: "Correo:",
						width: "25%"
					}),*/
					new sap.ui.core.Icon({
						src: "sap-icon://email",
						tooltip: "Correo",
						width: "10%"
					}).addStyleClass("styleIcon"),
					new sap.m.Input({
						id: "idResOrdenCompraCorreo",
						type: "Text",
						editable: false,
						width: "90%",
						value: varCorreo
					}),
					new sap.m.ToolbarSpacer({}),
					/*new sap.m.Label({
						text: "Telefono:",
						width: "25%"
					}),*/
					new sap.ui.core.Icon({
						src: "sap-icon://phone",
						tooltip: "Telefono",
						width: "10%"
					}).addStyleClass("styleIcon"),
					new sap.m.Input({
						id: "idResOrdenCompraTelefono",
						type: "Text",
						editable: false,
						width: "90%",
						value: varTelefono
					})
				],
				endButton: new sap.m.Button({
					text: 'OK',
					icon: 'sap-icon://accept',
					press: function () {
						oDialog.close();
						oDialog.destroy();
					}.bind(this)
				}),
				afterClose: function () {
					oDialog.destroy();
				},
			});
			oDialog.open();
		}
	});
});