sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Reporte_Consiganciones", {

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
		varTableT_TIP_CAR: "",
		varTableT_USER: "",
		varTableT_USUARIO_EMP: "",
		varTableT_USUARIO_PRO: "",
		varTableT_USUARIO_LOGIN: "",

		contPos: 0,
		contOC: 0,
		contDoc: 0,
		varRucDeLaEmpresa: "",
		onInit: function () {
			this.getRouter().getRoute("Vista_Reporte_Consiganciones").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("idTableItemFacturas").setSelectionMode("Single");
			this.getView().byId("idTableItemFacturas").setSelectionBehavior("RowOnly");
			this.getView().byId("idLogOff").addStyleClass("miIconoBlanco");
			this.getView().byId("idNavMenu").addStyleClass("miIconoBlanco");
			this.getView().byId("idFilter").addStyleClass("miIconoBlanco");
		},

		onAfterRendering: function (oEvent) {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
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
			this.varTableT_TIP_CAR = oModel.getProperty("/listTablasOData/clistTablasODataT_TIP_CAR");
			this.varTableT_USER = oModel.getProperty("/listTablasOData/clistTablasODataT_USER");
			this.varTableT_USUARIO_EMP = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_EMP");
			this.varTableT_USUARIO_PRO = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_PRO");
			this.varTableT_USUARIO_LOGIN = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_LOGIN");
		},

		_onRouteMatched: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
			oProductDetail1PanelCabecera.setVisible(false);
			var oProductDetail1PanelTabla = this.getView().byId("idPanelDetalle");
			oProductDetail1PanelTabla.setVisible(false);
			this.varRucDeLaEmpresa = oModel.getProperty("/usuarioRuc");
			this.cargaData();

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
			this.varTableT_TIP_CAR = oModel.getProperty("/listTablasOData/clistTablasODataT_TIP_CAR");
			this.varTableT_USER = oModel.getProperty("/listTablasOData/clistTablasODataT_USER");
			this.varTableT_USUARIO_EMP = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_EMP");
			this.varTableT_USUARIO_PRO = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_PRO");
			this.varTableT_USUARIO_LOGIN = oModel.getProperty("/listTablasOData/clistTablasODataT_USUARIO_LOGIN");
		},

		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		btnRegresarMenu: function () {
			//	this.getView().byId("idTableItemFacturas").removeSelections(true);
			this.getRouter().navTo("Vista_Menu_Principal");
			this.getView().byId("idListMaster1").removeSelections(true);
			var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
			oProductDetail1PanelCabecera.setVisible(false);
		},

		cargaData: function () {

			this.getView().byId("master1").setBusy(true);

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrix = [];
			var factura = {};
			var oThis = this;
			var oModel2 = oThis.getView().getModel("myParam");
			var varUsuario = oModel2.getProperty("/usuarioLogin");
			var varRUC = oModel2.getProperty("/usuarioRuc");
			oModel2.setProperty("/listFactura", []);
			var filterOrdenCompra = [];
			var filter;
			filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varUsuario);
			filterOrdenCompra.push(filter);
			filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, this.varRucDeLaEmpresa);
			filterOrdenCompra.push(filter);
			// Mostrar JSON
			//oModel.read("/T_CON_DETs?$format=json", {
			oModel.read("/" + this.varTableT_CON_DET + "?$format=json", {
				filters: filterOrdenCompra,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

					var lenghtV = oModelJSON.getData().length;

					var varRepetido1 = "";
					var varRepetido2 = "";
					var varRepetido3 = "";
					var varRepetido4 = "";
					var varContador = 0;
					for (var i = 0; i < lenghtV; i++) {
						var varWERKS = oModelJSON.getData()[i].WERKS;
						var varBUDATF = oModelJSON.getData()[i].BUDATF;
						var varBUDATI = oModelJSON.getData()[i].BUDATI;
						var varNAME1 = oModelJSON.getData()[i].NAME1;
						if (varWERKS !== varRepetido1 && varBUDATF !== varRepetido2 && varBUDATI !== varRepetido3 && varNAME1 !== varRepetido4) {
							factura = {};
							factura.MJAHR = oModelJSON.getData()[i].MJAHR;
							factura.BUDATF = oModelJSON.getData()[i].BUDATF;
							factura.BUDATI = oModelJSON.getData()[i].BUDATI;
							factura.BWAER = oModelJSON.getData()[i].BWAER;
							factura.ESTADO = oModelJSON.getData()[i].ESTADO;
							factura.FLAC = oModelJSON.getData()[i].FLAC;
							factura.MAKTX = oModelJSON.getData()[i].MAKTX;
							factura.MATNR = oModelJSON.getData()[i].MATNR;
							factura.MFRPN = oModelJSON.getData()[i].MFRPN;
							factura.NAME1 = oModelJSON.getData()[i].NAME1;
							factura.NETPR = oModelJSON.getData()[i].NETPR;
							factura.ZEILE = oModelJSON.getData()[i].ZEILE;
							factura.SHKZG = oModelJSON.getData()[i].SHKZG;
							factura.TIPO = oModelJSON.getData()[i].TIPO;
							factura.WRBTR = oModelJSON.getData()[i].WRBTR;
							factura.EM_RUC = oModelJSON.getData()[i].EM_RUC;
							factura.MBLNR = oModelJSON.getData()[i].MBLNR;
							factura.US_RUC = oModelJSON.getData()[i].US_RUC;
							factura.WERKS = oModelJSON.getData()[i].WERKS;
							factura.BLDAT = oModelJSON.getData()[i].BLDAT;
							factura.BSTME = oModelJSON.getData()[i].BSTME;
							factura.BSTMG = oModelJSON.getData()[i].BSTMG;
							//////
							varRepetido1 = oModelJSON.getData()[i].WERKS;
							varRepetido2 = oModelJSON.getData()[i].BUDATF;
							varRepetido3 = oModelJSON.getData()[i].BUDATI;
							varRepetido4 = oModelJSON.getData()[i].NAME1;
							varContador++;
							matrix.push(factura);
						}
					}

					oModel2.setProperty("/listFactura", matrix);
					this.getView().byId("idTituloOrden").setText("Facturas (" + varContador + ")");
					this.getView().byId("master1").setBusy(false);
				}.bind(this),
				error: function (oError) {
					oModel2.setProperty("/listFactura", []);
					this.getView().byId("idTituloOrden").setText("Facturas (0)");
					this.getView().byId("master1").setBusy(false);
					// Mensaje de Alerta de que termino el tiempo de sesión
					var dialogMensajeSesion = new sap.m.Dialog({
						draggable: true,
						resizable: true,
						contentWidth: "auto",
						title: "Mensaje de alerta",
						content: [
							new sap.m.Label({
								text: "Se concluyo la sesión o no tiene acceso a internet.",
								wrapping: true,
								width: "100%"
							})
						],
						state: "Warning",
						type: "Message",
						endButton: new sap.m.Button({
							press: function () {
								this.getRouter().navTo("Vista_Login");
								this.getView().setBusy(true);
								window.location.reload();
								dialogMensajeSesion.close();
								this.getView().setBusy(true);
							}.bind(this),
							text: "Aceptar"
						}),
						afterClose: function () {
							dialogMensajeSesion.destroy();
						},
						verticalScrolling: false
					});
					dialogMensajeSesion.open();
				}.bind(this)
			});
		},

		funcionNegrita: function (val) {

			if (val !== null && val !== undefined && val !== "") {
				if (val === "----") {
					return "Bold";
				} else if (val === "----------") {
					return "Bold";
				} else if (val === "-------------------------------") {
					return "Bold";
				} else if (val === "---") {
					return "Bold";
				} else if (val === "Total") {
					return "Bold";
				} else if (val.substring(0, 2) === "- ") {
					return "Bold";
				} else {
					return "Standard";
				}
			}
		},

		clicItemFactura: function (oEvent) {

			var oThis = this;
			this.getView().byId("detailF").setBusy(true);
			var oModel = oThis.getView().getModel("myParam");
			var itemSeleccionado = oEvent.getSource().getSelectedItem();
			var factura = itemSeleccionado.getBindingContext("myParam").getObject();
			oModel.setProperty("/listConsultaResumenFactura", factura);
			var varFiltro1 = oModel.getProperty("/listConsultaResumenFactura/US_RUC");
			var varFiltro2 = oModel.getProperty("/listConsultaResumenFactura/EM_RUC");
			var varFiltro3 = oModel.getProperty("/listConsultaResumenFactura/NAME1");
			var varFiltro4 = oModel.getProperty("/listConsultaResumenFactura/BUDATI");
			var varFiltro5 = oModel.getProperty("/listConsultaResumenFactura/BUDATF");
			var varFiltro6 = oModel.getProperty("/listConsultaResumenFactura/WERKS");

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModel2 = new sap.ui.model.odata.v2.ODataModel(url, true);
			var filtros = [];
			var filter;
			filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varFiltro1);
			filtros.push(filter);
			filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, varFiltro2);
			filtros.push(filter);
			filter = new sap.ui.model.Filter("NAME1", sap.ui.model.FilterOperator.EQ, varFiltro3);
			filtros.push(filter);
			filter = new sap.ui.model.Filter("BUDATI", sap.ui.model.FilterOperator.EQ, varFiltro4);
			filtros.push(filter);
			filter = new sap.ui.model.Filter("BUDATF", sap.ui.model.FilterOperator.EQ, varFiltro5);
			filtros.push(filter);
			filter = new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, varFiltro6);
			filtros.push(filter);

			//oModel2.read("/T_CON_DETs?$format=json", {
			oModel2.read("/" + this.varTableT_CON_DET + "?$format=json", {
				filters: filtros,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					oModel.setProperty("/listItemFacturas", []);
					//oModel.setProperty("/listItemFacturas", oModelJSON.getData());

					////////////////////////////////////////////////////////////////////////7
					var varDatosTabla2 = [];
					var varRegistroTabla2 = {};
					for (var i = 0; i < lenghtV; i++) {
						var varOpcEnt = true;
						var varDatoT1 = oModelJSON.getData()[i].MATNR;
						var varCodigoMaterial = "";
						var varConteo = 0;
						varRegistroTabla2 = oModel.getProperty("/listItemFacturas");
						for (var j = 0; j < varRegistroTabla2.length; j++) {
							if (varDatoT1 === varRegistroTabla2[j].MATNR) {
								varOpcEnt = false;
							}
						}
						if (varOpcEnt === true) {
							var varContarCantidad = 0;
							var varContarTotal = 0;
							for (var k = 0; k < lenghtV; k++) {
								if (varDatoT1 === oModelJSON.getData()[k].MATNR) {
									varRegistroTabla2 = {};
									varRegistroTabla2.BLDAT = oModelJSON.getData()[k].BLDAT;
									varRegistroTabla2.BSTME = oModelJSON.getData()[k].BSTME;
									varRegistroTabla2.BSTMG = oModelJSON.getData()[k].BSTMG;
									varRegistroTabla2.BWAER = oModelJSON.getData()[k].BWAER;
									varRegistroTabla2.MAKTX = oModelJSON.getData()[k].MAKTX;
									varRegistroTabla2.MATNR = oModelJSON.getData()[k].MATNR;
									varRegistroTabla2.MBLNR = oModelJSON.getData()[k].MBLNR;
									varRegistroTabla2.MJAHR = oModelJSON.getData()[k].MJAHR;
									varRegistroTabla2.WRBTR = oModelJSON.getData()[k].WRBTR;
									varRegistroTabla2.ZEILE = oModelJSON.getData()[k].ZEILE;
									varContarCantidad = varContarCantidad + parseFloat(oModelJSON.getData()[k].BSTMG, 10);
									varContarTotal = varContarTotal + parseFloat(oModelJSON.getData()[k].WRBTR, 10);
									varCodigoMaterial = oModelJSON.getData()[k].MATNR;
									varConteo++;
									varDatosTabla2.push(varRegistroTabla2);
								}
							}
							if (varConteo !== 0) {
								varRegistroTabla2 = {};
								varRegistroTabla2.MJAHR = "----";
								varRegistroTabla2.MBLNR = "----------";
								varRegistroTabla2.ZEILE = "----";
								varRegistroTabla2.BLDAT = "----------";
								varRegistroTabla2.MATNR = "- " + varCodigoMaterial + " -";
								varRegistroTabla2.MAKTX = "-------------------------------";
								varRegistroTabla2.BSTMG = "- " + varContarCantidad + " -";
								varRegistroTabla2.BSTME = "Total";
								varRegistroTabla2.WRBTR = varContarTotal.toFixed(2);
								varRegistroTabla2.BWAER = "---";
								varDatosTabla2.push(varRegistroTabla2);
							}
						}
						oModel.setProperty("/listItemFacturas", varDatosTabla2);
					}

					////////////////////////////////////////////////////////////////////////7

					// Suma de los importes de cada Item
					var varSumaImporte = 0;
					for (var i = 0; i < lenghtV; i++) {
						//varSumaImporte = varSumaImporte + parseFloat(oModel.getProperty("/listItemFacturas/" + i + "/WRBTR"), 10);
						varSumaImporte = varSumaImporte + parseFloat(oModelJSON.getData()[i].WRBTR, 10);
					}
					//this.getView().byId("ohFac").setNumber(varSumaImporte.toString());
					oModel.setProperty("/varImporteTotal", varSumaImporte.toFixed(2));

					oModel.setProperty("/listItemFacturasLenght", lenghtV);
					this.getView().byId("detailF").setBusy(false);
					this.getView().byId("idTableItemFacturas").getBinding("rows").refresh(true);
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listItemFacturas", []);
					oModel.setProperty("/listItemFacturasLenght", 0);
					this.getView().byId("detailF").setBusy(false);
					this.getView().byId("idTableItemFacturas").getBinding("rows").refresh(true);
					// Mensaje de Alerta de que termino el tiempo de sesión
					var dialogMensajeSesion = new sap.m.Dialog({
						draggable: true,
						resizable: true,
						contentWidth: "auto",
						title: "Mensaje de alerta",
						content: [
							new sap.m.Label({
								text: "Se concluyo la sesión o no tiene acceso a internet.",
								wrapping: true,
								width: "100%"
							})
						],
						state: "Warning",
						type: "Message",
						endButton: new sap.m.Button({
							press: function () {
								this.getRouter().navTo("Vista_Login");
								this.getView().setBusy(true);
								window.location.reload();
								dialogMensajeSesion.close();
								this.getView().setBusy(true);
							}.bind(this),
							text: "Aceptar"
						}),
						afterClose: function () {
							dialogMensajeSesion.destroy();
						},
						verticalScrolling: false
					});
					dialogMensajeSesion.open();
				}.bind(this)
			});

			this.getView().byId("ohFac").setVisible(true);
			this.getView().byId("idPanelDetalle").setVisible(true);
		},

		btnFiltros: function () {

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var myParam = this.getView().getModel("myParam");

			var oTable = new sap.ui.table.Table({
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				width: "30.3rem",
				rows: "{myParam>/tblFiltros}"
			});
			oTable.addColumn(new sap.ui.table.Column({
				width: "3rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: ""
				}),
				template: new sap.m.CheckBox({
					selected: "{myParam>/selectFiltro/opc}",
					valueState: "Warning",
					select: function (evt) {

					}.bind(this)
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Tipo de Filtro"
				}),
				template: new sap.m.Text({
					text: "{myParam>ctblFiltrosTipo}"
				})
			}));
			oTable.setModel(myParam);

			var oDialog = new sap.m.Dialog("idDialogSelectItems", {

				title: "Seleccionar de Filtros",
				icon: "sap-icon://filter",
				contentWidth: "auto",
				resizable: true,
				draggable: true,
				type: "Message",
				content: [
					oTable
				],
				beginButton: new sap.m.Button({
					id: 'idButtonAceptar',
					text: 'Aceptar',
					type: 'Emphasized',
					icon: 'sap-icon://accept',
					press: function () {

					}.bind(this)
				}),
				endButton: new sap.m.Button({
					icon: "sap-icon://cancel",
					text: "Cerrar",
					press: function () {
						oDialog.close();
					}.bind(this)
				}),
			});
		}
	});
});