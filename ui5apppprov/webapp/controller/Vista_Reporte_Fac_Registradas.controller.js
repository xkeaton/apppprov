sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	'sap/ui/export/Spreadsheet'
], function (Controller, Export, ExportTypeCSV, Spreadsheet) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller..Vista_Reporte_Fac_Registradas", {

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

		onInit: function () {

			var oView = this.getView();

			this.getRouter().getRoute("Vista_Reporte_Fac_Registradas").attachMatched(this._onRouteMatched, this);
			this.getView().byId("idTableResFacReg").setSelectionMode("None");
			this.getView().byId("idTableResFacReg").setSelectionBehavior("RowOnly");
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("idNavMenu").addStyleClass("miIconoBlanco");

			//var oProductNameColumn = oView.byId("sortFecPreReg");
			//oView.byId("idTableResFacReg").sort("sortFecPreReg", new sap.ui.model.Sorter("sortFecPreReg", true));
			//new sap.ui.model.Sorter("sortFecPreReg", true);

			/*var SORTKEY = "sortFecPreReg";
			var DESCENDING = true;
			var GROUP = false;
			var oList = this.getView().byId("idTableResFacReg");
			var oBinding = oList.getBinding("rows");
			var aSorter = [];
			// you may use foo.bar.CustomSorter instead:
			//aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			aSorter = new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			oBinding.sort(aSorter);*/
		},

		_onRouteMatched: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");

		
			oModel.setProperty("/listResFacReg", []); 

			// var comboTipo = this.getView().byId("idTipoCarga");
			// comboTipo.getBinding("items").refresh(true);
			// var firstItem = comboTipo.getItems()[0];
			// comboTipo.setSelectedItem(firstItem, true);
			// this.getView().byId("idTipoCarga").setValueState("None");
		

			this.varRucDeLaEmpresa = oModel.getProperty("/usuarioRuc");

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
			this.varTableT_SERVICIOS = oModel.getProperty("/listTablasOData/clistTablasODataT_SERVICIOS");
			
				var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);
			oModelOData.read("/" + this.varTableT_SERVICIOS + "?$format=json", {
				success: function (response) {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						for (var i = 0; i < tamTabla; i++) {
							if(oModelJSON.getData()[i].SERVICIO === "Validacion_reporte01"){
								var valorServicio = parseInt(oModelJSON.getData()[i].CAMPO1.toString());
								var d = new Date();
								d.setDate(d.getDate() - valorServicio);
								this.getView().byId("idFecEmision").setDateValue(d);
								this.getView().byId("idFecPago").setDateValue(new Date());
									this.getDataResFacReg2();
							}
						}
				}.bind(this),
				error: function (oError) {
							this.getView().byId("idFecEmision").setDateValue(new Date());
			this.getView().byId("idFecPago").setDateValue(new Date());
				this.getDataResFacReg();
				}.bind(this)
			});
		},

		onAfterRendering: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");

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

			//this.getDataResFacReg();
		},

		btnInicio: function () {
			this.getRouter().navTo("Vista_Menu_Principal");
		},

		btnRegresarMenu: function () {
			this.getRouter().navTo("Vista_Menu_Principal");
		},

		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getDataResFacReg: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			this.getView().byId("idTableResFacReg").setBusy(true);

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);

			var varUsuario = oModel.getProperty("/usuarioLogin");
			var varRUC = oModel.getProperty("/usuarioRuc");
			var allFilters = [];
			var sorters = [];
			var filter;
			var sorter;
			filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varUsuario);
			allFilters.push(filter);
			filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, varRUC);
			allFilters.push(filter);

			sorter = new sap.ui.model.Sorter("FEC_PAGO", true);
			sorters.push(sorter);

			oModelJson.read("/" + this.varTableT_FAC + "?$format=json", {
				filters: allFilters,
				//sorters: sorters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var tamTabla = oModelJSON.getData().length;
					//var vector = oModel.getProperty("/listResFacReg");
					var vector = [];

					var llave = {};
					for (var i = 0; i < tamTabla; i++) {
						llave = {};
						llave.ESTADO = oModelJSON.getData()[i].ESTADO;
						llave.ESTADO2 = this.formatoEstado(oModelJSON.getData()[i].ESTADO);
						llave.TIPO_CARGA = oModelJSON.getData()[i].TIPO_CARGA;
						llave.TIPO_CARGA2 = this.formatoTipoCarga(oModelJSON.getData()[i].TIPO_CARGA);
						this.formatoComprobante(oModelJSON.getData()[i].ID_FACTURA);
						llave.REFERENCIA = oModelJSON.getData()[i].TIPO_DOC + "-" + this.formatoComprobante(oModelJSON.getData()[i].ID_FACTURA);
						llave.FC_FEC_EMISION = oModelJSON.getData()[i].FC_FEC_EMISION;
						//llave.FC_FEC_REGISTRO = this.funFormatoFecha(oModelJSON.getData()[i].FC_FEC_REGISTRO);
						llave.FC_FEC_REGISTRO = oModelJSON.getData()[i].FC_FEC_REGISTRO;
						llave.FEC_JOB = oModelJSON.getData()[i].FEC_JOB;
						llave.TOTAL_CON_IGV = parseFloat(oModelJSON.getData()[i].TOTAL_IMP, 10).toFixed(2);
						llave.TOTAL_IGV = parseFloat(oModelJSON.getData()[i].TOTAL_IGV, 10).toFixed(2);
						var varRestaImpIGV = parseFloat(oModelJSON.getData()[i].TOTAL_IMP, 10) - parseFloat(oModelJSON.getData()[i].TOTAL_IGV, 10);
						llave.TOTAL_SIN_IGV = varRestaImpIGV.toFixed(2);
						llave.MONEDA = oModelJSON.getData()[i].MONEDA;
						llave.FEC_PAGO = oModelJSON.getData()[i].FEC_PAGO;
						llave.FEC_VENCIMIENTO = oModelJSON.getData()[i].FEC_VENCIMIENTO;
						vector.push(llave);
					}
					oModel.setProperty("/listResFacReg", vector);
					this.getView().byId("idTableResFacReg").setBusy(false);
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listResFacReg", []);
					this.getView().byId("idTableResFacReg").setBusy(false);
					this.getView().setBusy(false);
					// Mensaje de Alerta de que termino el tiempo de sesión
					var dialogMensajeSesion = new sap.m.Dialog({
						draggable: true,
						resizable: true,
						contentWidth: "auto",
						title: "Mensaje de alerta",
						content: [
							new sap.m.Label({
								text: "Se ha perdido la conexión, se debe actualizar la página...",
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
		getDataResFacReg2: function () {
	var canContinue = true;
						var inputs = [
							this.getView().byId("idFecEmision"),
							this.getView().byId("idFecPago")
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
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			this.getView().byId("idTableResFacReg").setBusy(true);

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);

			var varUsuario = oModel.getProperty("/usuarioLogin");
			var varRUC = oModel.getProperty("/usuarioRuc");
			var allFilters = [];
			var sorters = [];
			var filter;
			var sorter;
			filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varUsuario);
			allFilters.push(filter);
			filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, varRUC);
			allFilters.push(filter);

			sorter = new sap.ui.model.Sorter("FEC_PAGO", true);
			sorters.push(sorter);

			oModelJson.read("/" + this.varTableT_FAC + "?$format=json", {
				filters: allFilters,
				//sorters: sorters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var tamTabla = oModelJSON.getData().length;
					//var vector = oModel.getProperty("/listResFacReg");
					var vector = [];

					var llave = {};
					for (var i = 0; i < tamTabla; i++) {
						llave = {};
						llave.ESTADO = oModelJSON.getData()[i].ESTADO;
						llave.ESTADO2 = this.formatoEstado(oModelJSON.getData()[i].ESTADO);
						llave.TIPO_CARGA = oModelJSON.getData()[i].TIPO_CARGA;
						llave.TIPO_CARGA2 = this.formatoTipoCarga(oModelJSON.getData()[i].TIPO_CARGA);
						this.formatoComprobante(oModelJSON.getData()[i].ID_FACTURA);
						llave.REFERENCIA = oModelJSON.getData()[i].TIPO_DOC + "-" + this.formatoComprobante(oModelJSON.getData()[i].ID_FACTURA);
						llave.FC_FEC_EMISION = oModelJSON.getData()[i].FC_FEC_EMISION;
						//llave.FC_FEC_REGISTRO = this.funFormatoFecha(oModelJSON.getData()[i].FC_FEC_REGISTRO);
						llave.FC_FEC_REGISTRO = oModelJSON.getData()[i].FC_FEC_REGISTRO;
						llave.FEC_JOB = oModelJSON.getData()[i].FEC_JOB;
						llave.TOTAL_CON_IGV = parseFloat(oModelJSON.getData()[i].TOTAL_IMP, 10).toFixed(2);
						llave.TOTAL_IGV = parseFloat(oModelJSON.getData()[i].TOTAL_IGV, 10).toFixed(2);
						var varRestaImpIGV = parseFloat(oModelJSON.getData()[i].TOTAL_IMP, 10) - parseFloat(oModelJSON.getData()[i].TOTAL_IGV, 10);
						llave.TOTAL_SIN_IGV = varRestaImpIGV.toFixed(2);
						llave.MONEDA = oModelJSON.getData()[i].MONEDA;
						llave.FEC_PAGO = oModelJSON.getData()[i].FEC_PAGO;
						llave.FEC_VENCIMIENTO = oModelJSON.getData()[i].FEC_VENCIMIENTO;
						var fecha2 = this.getView().byId("idFecEmision").getValue();
							var fecha1 = this.getView().byId("idFecPago").getValue();
							var fechaRegistro = oModelJSON.getData()[i].FC_FEC_REGISTRO;
							fechaRegistro = fechaRegistro.split("/");
									fechaRegistro = fechaRegistro[0] + "" + fechaRegistro[1] + "" + fechaRegistro[2];
									fechaRegistro = parseInt(fechaRegistro.toString(), 10);
									if (parseInt(fecha1, 10) >= fechaRegistro && parseInt(fecha2, 10) <= fechaRegistro) {
										vector.push(llave);
									}
						
						//vector.push(llave);
					}
					oModel.setProperty("/listResFacReg", vector);
					this.getView().byId("idTableResFacReg").setBusy(false);
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listResFacReg", []);
					this.getView().byId("idTableResFacReg").setBusy(false);
					this.getView().setBusy(false);
					// Mensaje de Alerta de que termino el tiempo de sesión
					var dialogMensajeSesion = new sap.m.Dialog({
						draggable: true,
						resizable: true,
						contentWidth: "auto",
						title: "Mensaje de alerta",
						content: [
							new sap.m.Label({
								text: "Se ha perdido la conexión, se debe actualizar la página...",
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
						} else {
							var dialog = new sap.m.Dialog({
								title: "Alerta",
								type: "Message",
								state: "Warning",
								content: new sap.m.Text({
									text: "Se requiere ingresar todos los campos."

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
						}
		},
		formatoEstado: function (est) {

			if (est !== "" && est !== null && est !== undefined) {
				if (est === "P") {
					return "Pre-registrado";
				} else if (est === "C") {
					return "Contabilizado";
				} else if (est === "O") {
					return "Observado";
				} else if (est === "R") {
					return "Registrado";
				} else if (est === "E") {
					return "Error de registro";
				} else if (est === "G") {
					return "Pagado";
				}
			} else {
				return "Sin Asignar";
			}
		},

		formatEstadoFactura2: function (est) {

			if (est !== "" && est !== null && est !== undefined) {
				if (est === "P") {
					return "Information";
				} else if (est === "R") {
					return "Warning";
				} else if (est === "C") {
					return "Warning";
				} else if (est === "G") {
					return "Success";
				} else if (est === "O") {
					return "Error";
				} else if (est === "N") {
					//return "#8cff66";
					return "Warning";
				} else {
					return "Error";
				}
			} else {
				return "Error";
			}
		},

		formatEstadoFactura3: function (est) {

			if (est !== "" && est !== null && est !== undefined) {
				if (est === "P") {
					return 1;
				} else if (est === "C") {
					return 6;
				} else if (est === "O") {
					return 3;
				} else if (est === "R") {
					return 7;
				} else if (est === "E") {
					return 3;
				} else if (est === "G") {
					return 8;
				}
			} else {
				return 9;
			}
		},

		btnFiltrar: function () {

			var filter;
			var filters1 = [];
			var filters2 = [];
			var filters3 = [];
			var filters4 = [];
			var filtersT = [];

			var varTipoCarga = this.getView().byId("idTipoCarga").getSelectedKey().toString();
			/*var varNumFactura = this.getView().byId("idNumFactura").getValue().toString();
			var varFecEmision = this.getView().byId("idFecEmision").getValue().toString();
			var varFecPago = this.getView().byId("idFecPago").getValue().toString();*/


			if (varTipoCarga !== "" && varTipoCarga !== "T") {
				filter = new sap.ui.model.Filter("TIPO_CARGA", sap.ui.model.FilterOperator.EQ, varTipoCarga);
				filters1.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters1, false));
			} else {
				filter = new sap.ui.model.Filter("TIPO_CARGA", sap.ui.model.FilterOperator.Contains, "");
				filters1.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters1, false));
			}


			var list = this.getView().byId("idTableResFacReg");
			var binding = list.getBinding("rows");
			binding.filter(new sap.ui.model.Filter(filtersT, true));
		},

		formatoComprobante: function (val) {

			var varbinpallettxt = "";
			var vectorbinpallettxt = [];
			var llavebinpallettxt = {};
			for (var k = 0; k < val.length; k++) {
				if (val.substring(k, k + 1) !== "-") {
					varbinpallettxt = varbinpallettxt + val.substring(k, k + 1);
				}
				if (val.substring(k, k + 1) === "-" || k === val.length - 1) {
					llavebinpallettxt = {};
					llavebinpallettxt.Dato = varbinpallettxt;
					vectorbinpallettxt.push(llavebinpallettxt);
					varbinpallettxt = "";
				}
			}

			var varComprobante = vectorbinpallettxt[1].Dato.toString();

			var varTamNumSerie = varComprobante.length;

			var varNenNumSerie = "";
			if (varTamNumSerie === 8) {
				varNenNumSerie = varComprobante;
			} else if (varTamNumSerie === 7) {
				varNenNumSerie = "0" + varComprobante;
			} else if (varTamNumSerie === 6) {
				varNenNumSerie = "00" + varComprobante;
			} else if (varTamNumSerie === 5) {
				varNenNumSerie = "000" + varComprobante;
			} else if (varTamNumSerie === 4) {
				varNenNumSerie = "0000" + varComprobante;
			} else if (varTamNumSerie === 3) {
				varNenNumSerie = "00000" + varComprobante;
			} else if (varTamNumSerie === 2) {
				varNenNumSerie = "000000" + varComprobante;
			} else if (varTamNumSerie === 1) {
				varNenNumSerie = "0000000" + varComprobante;
			}

			var varResultado = vectorbinpallettxt[0].Dato.toString() + "-" + varNenNumSerie.toString();

			return varResultado;
		},

		formatoTipoCarga: function (est) {

			if (est !== "" && est !== null && est !== undefined) {
				if (est === "N") {
					return "Consignación";
				} else if (est === "C") {
					return "Contratista";
				} else if (est === "V") {
					return "Nota de Cred. sin pedido";
				} else if (est === "S") {
					return "Suministros";
				} else if (est === "H") {
					return "Servicios";
				} else if (est === "M") {
					return "Miscelaneos";
				} else if (est === "D") {
					return "Nota de Cred. con pedido";
				}
			} else {
				return "Sin Vale/HES";
			}
		},

		funFormatoFecha: function (fecha) {

			if (fecha !== "" && fecha !== null && fecha !== undefined) {
				var vartxt1 = "";
				var vectortxt1 = [];
				var llavetxt1 = {};
				for (var k = 0; k < fecha.length; k++) {
					if (fecha.substring(k, k + 1) !== "/") {
						vartxt1 = vartxt1 + fecha.substring(k, k + 1);
					}
					if (fecha.substring(k, k + 1) === "/" || k === fecha.length - 1) {
						llavetxt1 = {};
						llavetxt1.Dato = vartxt1;
						vectortxt1.push(llavetxt1);
						vartxt1 = "";
					}
				}

				var varFechaModificada;
				if (vectortxt1.length !== 0) {
					varFechaModificada = vectortxt1[0].Dato + "-" + vectortxt1[1].Dato + "-" + vectortxt1[2].Dato;
				} else {
					varFechaModificada = fecha;
				}
				return varFechaModificada;
			}
		},

		onPressExcel: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");

			var varT_FAC_REGISTRADAS = oModel.getProperty("/listResFacReg");

			oModel.setProperty("/tblResFacRegExcel", varT_FAC_REGISTRADAS);

			this.onExport();
		},

		onExport: function () {
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel("myParam").getProperty('/tblResFacRegExcel');

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: aProducts,
				fileName: "RepFacturasRegistradas.xlsx"
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {
					this.getView().setBusy(false);
					sap.m.MessageToast.show("Se realizó la exportación del reporte con éxito.");
				}.bind(this))
				.finally(function () {
					this.getView().setBusy(false);
					oSheet.destroy();
				}.bind(this));
		},

		createColumnConfig: function () {

			var aCols = [];

			aCols.push({
				label: 'Estado',
				property: 'ESTADO2',
				type: 'string'
			});
			aCols.push({
				label: 'Tipo de Carga',
				property: 'TIPO_CARGA2',
				type: 'string'
			});
			aCols.push({
				label: 'Número factura',
				property: 'REFERENCIA',
				type: 'string'
			});
			aCols.push({
				label: 'F. de emisión',
				property: 'FC_FEC_EMISION',
				type: 'string'
			});
			aCols.push({
				label: 'F. de registro',
				property: 'FC_FEC_REGISTRO',
				type: 'string'
			});
			/*aCols.push({
				label: 'F. prog. pago',
				property: 'FEC_VENCIMIENTO',
				type: 'string'
			});*/
			aCols.push({
				label: 'F. de pago',
				property: 'FEC_PAGO',
				type: 'string'
			});
			aCols.push({
				label: 'Importe con IGV',
				property: 'TOTAL_CON_IGV',
				type: 'string'
			});
			aCols.push({
				label: 'Total IGV',
				property: 'TOTAL_IGV',
				type: 'string'
			});
			aCols.push({
				label: 'Importe sin IGV',
				property: 'TOTAL_SIN_IGV',
				type: 'string'
			});
			aCols.push({
				label: 'Moneda',
				property: 'MONEDA',
				type: 'string'
			});

			return aCols;
		}
	});
});