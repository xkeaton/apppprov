sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	'sap/ui/export/Spreadsheet'
], function (Controller, Export, ExportTypeCSV, Spreadsheet) {
	"use strict";
	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Administrador_Usuarios", {
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
		varTableT_SERVICIOS: "",
		onInit: function () {
			var oThis = this;
			oThis.getRouter().getRoute("Vista_Administrador_Usuarios").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("idTableUser").setSelectionMode("None");
			this.getView().byId("idTableUser").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableEmpresa").setSelectionMode("None");
			this.getView().byId("idTableEmpresa").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableServicios").setSelectionMode("None");
			this.getView().byId("idTableServicios").setSelectionBehavior("RowOnly");

			this.getView().byId("idTableDetraccion").setSelectionMode("None");
			this.getView().byId("idTableDetraccion").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableMatDetraccion").setSelectionMode("None");
			this.getView().byId("idTableMatDetraccion").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableServDetraccion").setSelectionMode("None");
			this.getView().byId("idTableServDetraccion").setSelectionBehavior("RowOnly");

			this.getView().byId("idNav").addStyleClass("miIconoBlanco");
		},
		onAfterRendering: function (oEvent) {
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			// Tablas11
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
			this.varTableT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_DETRACCION");
			this.varTableT_SERV_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_SERV_DETRACCION");
			this.varTableT_MAT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_MAT_DETRACCION");

			this.getView().byId("idTxtRuc").setValue("");
		},

		funInsertarRegistro: function () {

			var llave = {};
			llave.CAMPO1 = "2";
			llave.CAMPO2 = "";
			llave.CAMPO3 = "";
			llave.ESTADO = "X";
			llave.FLAG1 = "";
			llave.FLAG2 = "";
			llave.FLAG3 = "";
			llave.SERVICIO = "Validacion_dias_calendario";

			var url = "" + this.varTableURL + "/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);

			oModel.create("/" + this.varTableT_SERVICIOS + "", llave, {
				method: "POST",
				success: function (data) {
					console.log("OK");
				}.bind(this),
				error: function (data) {
					console.log("ERROR");
				}.bind(this)
			});
		},

		onBeforeRendering: function () {
			this.getView().byId("idTxtRuc").setValue("");
		},
		onExit: function () {
			this.getView().byId("idTxtRuc").setValue("");
		},
		_onRouteMatched: function () {
			this.getView().byId("idTxtRuc").setValue("");
			//this.getDataUsuarios();
			//this.llenarTablas("T_USER", "listUsuarios");
			this.llenarTablas("" + this.varTableT_USER + "", "listUsuarios");
			//this.llenarTablas("T_CEN", "listEmpresa");
			this.llenarTablas("" + this.varTableT_CEN + "", "listEmpresa");
			this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
			this.llenarTablas("" + this.varTableT_DETRACCION + "", "listDetraccion");
			this.llenarTablas("" + this.varTableT_MAT_DETRACCION + "", "listMatDetraccion");
			this.llenarTablas("" + this.varTableT_SERV_DETRACCION + "", "listServDetraccion");
			//this.getView().byId("idChaeckEstan").setSelected(false);
			//this.getView().byId("idChaeckAdmin").setSelected(false);
			var oIconBarEnProcesoPrincipal = this.getView().byId("idTabBarFac");
			oIconBarEnProcesoPrincipal.setSelectedKey("Usuarios");
			this.btnBuscarRuc();
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
			this.varTableT_SERVICIOS = oModel.getProperty("/listTablasOData/clistTablasODataT_SERVICIOS");
			this.varTableT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_DETRACCION");
			this.varTableT_SERV_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_SERV_DETRACCION");
			this.varTableT_MAT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_MAT_DETRACCION");

			this.getView().byId("idTxtRuc").setValue("");
			this.updateServicioSunat();
			this.updateServicioDiaHabil();
		},
		onPressCrearDetraccion: function (evt) {

			var dialog2 = new sap.m.Dialog({
				title: 'Crear Detracción',
				icon: "sap-icon://document-text",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "600px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Número : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idNumero",
								placeholder: "Ingrese número (2)...",
								maxLength: 2,
								width: "70%",
								editable: true,
								liveChange: function (evt) {
									var valor = evt.getSource();
									var value = valor.getValue();
									var valor2 = value.replace(/[^\d]/g, '');
									valor.setValue(valor2);
								}
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Descripción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idDes",
								placeholder: "Ingrese descripción (200) ...",
								maxLength: 200,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Prioridad : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idPri",
								placeholder: "Ingrese prioridad (2) ...",
								maxLength: 2,
								width: "70%",
								editable: true,
								liveChange: function (evt) {
									var valor = evt.getSource();
									var value = valor.getValue();
									var valor2 = value.replace(/[^\d]/g, '');
									valor.setValue(valor2);
								}
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Guardar',
					icon: "sap-icon://save",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idNumero"),
							sap.ui.getCore().byId("idDes"),
							sap.ui.getCore().byId("idPri")
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
							this.getView().setBusy(true);
							var llave = {};
							llave.NUMTP = sap.ui.getCore().byId("idNumero").getValue();
							llave.NTBEZ = sap.ui.getCore().byId("idDes").getValue();
							llave.PRIORIDAD = sap.ui.getCore().byId("idPri").getValue();
							llave.CHAR1 = "";
							llave.CHAR2 = "";
							llave.FLAG1 = "";
							llave.FLAG2 = "";
							var descripcion = sap.ui.getCore().byId("idDes").getValue();
							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							//oModel.create("/T_CENs", llave, {
							oModel.create("/" + this.varTableT_DETRACCION + "", llave, {
								method: "POST",
								success: function (data) {
									this.getView().setBusy(false);
									dialog2.close();
									var dialogA = new sap.m.Dialog({
										title: "Se registró con éxito",
										type: "Message",
										state: "Success",
										content: new sap.m.Text({
											text: "Se ingresó correctamente la detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												//this.llenarTablas("T_CEN", "listEmpresa");
												this.llenarTablas("" + this.varTableT_DETRACCION + "", "listDetraccion");
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)

									});
									dialogA.open();
								}.bind(this),
								error: function (data) {
									this.getView().setBusy(false);
									var dialogA = new sap.m.Dialog({
										title: "Se ha generado un error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "No se registró la detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												dialogA.close();
											}
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
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

					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		onPressCrearMatDetraccion: function (evt) {
			var model = this.getView().getModel("myParam");
			sap.ui.getCore().setModel(model);
			var dialog2 = new sap.m.Dialog({
				title: 'Crear Materia de detracción',
				icon: "sap-icon://course-program",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "600px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Número de material : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idNumero",
								placeholder: "Ingrese número (18)...",
								maxLength: 18,
								width: "70%",
								editable: true,
								liveChange: function (evt) {
									var valor = evt.getSource();
									var value = valor.getValue();
									var valor2 = value.replace(/[^\d]/g, '');
									valor.setValue(valor2);
								}
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Descripción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idDes",
								placeholder: "Ingrese descripción (200) ...",
								maxLength: 200,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "N° de detracción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.ComboBox({
								id: "idPri",
								valueStateText: "Se requiere seleccionar un n° de detacción.",
								placeholder: "Seleccione n° de detracción ...", // string
								items: {
									path: "/listDetraccion",
									template: new sap.ui.core.Item({
										key: "{NUMTP}",
										text: "{NUMTP} - {NTBEZ}"
									})
								},
								width: "70%"
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Guardar',
					icon: "sap-icon://save",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idNumero"),
							sap.ui.getCore().byId("idDes")
						];
						var selects = [
							sap.ui.getCore().byId("idPri")
						];
						jQuery.each(inputs, function (i, input) {
							if (!input.getValue()) {
								input.setValueState("Error");
								canContinue = false;
							} else {
								input.setValueState("None");
							}
						});
						jQuery.each(selects, function (i, select) {
							if (!select.getSelectedItem()) {
								select.setValueState("Error");
								canContinue = false;
							} else {
								select.setValueState("None");
							}
						});
						if (canContinue) {
							this.getView().setBusy(true);
							var llave = {};
							llave.NUMTP = sap.ui.getCore().byId("idPri").getSelectedItem().getKey();
							llave.DE_DESCRIPCION = sap.ui.getCore().byId("idDes").getValue();
							llave.DE_NUM_MATERIAL = sap.ui.getCore().byId("idNumero").getValue();
							llave.CHAR1 = "";
							llave.CHAR2 = "";
							llave.FLAG1 = "";
							llave.FLAG2 = "";
							var descripcion = sap.ui.getCore().byId("idDes").getValue();
							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							//oModel.create("/T_CENs", llave, {
							oModel.create("/" + this.varTableT_MAT_DETRACCION + "", llave, {
								method: "POST",
								success: function (data) {
									this.getView().setBusy(false);
									dialog2.close();
									var dialogA = new sap.m.Dialog({
										title: "Se registró con éxito",
										type: "Message",
										state: "Success",
										content: new sap.m.Text({
											text: "Se ingresó correctamente la materia de detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												//this.llenarTablas("T_CEN", "listEmpresa");
												this.llenarTablas("" + this.varTableT_MAT_DETRACCION + "", "listMatDetraccion");
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)

									});
									dialogA.open();
								}.bind(this),
								error: function (data) {
									this.getView().setBusy(false);
									var dialogA = new sap.m.Dialog({
										title: "Se ha generado un error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "No se registró la materia de detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												dialogA.close();
											}
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
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

					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				},
				afterOpen: function () {
					var selects = [
						sap.ui.getCore().byId("idPri")
					];
					var firstItem;
					jQuery.each(selects, function (i, select) {
						select.getBinding("items").refresh(true);
						firstItem = select.getItems()[0];
						select.setSelectedItem(firstItem, true);
					});
				}.bind(this),
			});
			dialog2.open();
		},
		onPressCrearServDetraccion: function (evt) {
			var model = this.getView().getModel("myParam");
			sap.ui.getCore().setModel(model);
			var dialog2 = new sap.m.Dialog({
				title: 'Crear Servicio de detracción',
				icon: "sap-icon://ppt-attachment",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "600px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Número de servicio : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idNumero",
								placeholder: "Ingrese número (18)...",
								maxLength: 18,
								width: "70%",
								editable: true,
								liveChange: function (evt) {
									var valor = evt.getSource();
									var value = valor.getValue();
									var valor2 = value.replace(/[^\d]/g, '');
									valor.setValue(valor2);
								}
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Descripción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idDes",
								placeholder: "Ingrese descripción (200) ...",
								maxLength: 200,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "N° de detracción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.ComboBox({
								id: "idPri",
								valueStateText: "Se requiere seleccionar un n° de detacción.",
								placeholder: "Seleccione n° de detracción ...", // string
								items: {
									path: "/listDetraccion",
									template: new sap.ui.core.Item({
										key: "{NUMTP}",
										text: "{NUMTP} - {NTBEZ}"
									})
								},
								width: "70%"
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Guardar',
					icon: "sap-icon://save",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idNumero"),
							sap.ui.getCore().byId("idDes")
						];
						var selects = [
							sap.ui.getCore().byId("idPri")
						];
						jQuery.each(inputs, function (i, input) {
							if (!input.getValue()) {
								input.setValueState("Error");
								canContinue = false;
							} else {
								input.setValueState("None");
							}
						});
						jQuery.each(selects, function (i, select) {
							if (!select.getSelectedItem()) {
								select.setValueState("Error");
								canContinue = false;
							} else {
								select.setValueState("None");
							}
						});
						if (canContinue) {
							this.getView().setBusy(true);
							var llave = {};
							llave.NUMTP = sap.ui.getCore().byId("idPri").getSelectedItem().getKey();
							llave.DE_DESCRIPCION = sap.ui.getCore().byId("idDes").getValue();
							llave.DE_NUM_SERVICIO = sap.ui.getCore().byId("idNumero").getValue();
							llave.CHAR1 = "";
							llave.CHAR2 = "";
							llave.FLAG1 = "";
							llave.FLAG2 = "";
							var descripcion = sap.ui.getCore().byId("idDes").getValue();
							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							//oModel.create("/T_CENs", llave, {
							oModel.create("/" + this.varTableT_SERV_DETRACCION + "", llave, {
								method: "POST",
								success: function (data) {
									this.getView().setBusy(false);
									dialog2.close();
									var dialogA = new sap.m.Dialog({
										title: "Se registró con éxito",
										type: "Message",
										state: "Success",
										content: new sap.m.Text({
											text: "Se ingresó correctamente el servicio de detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												//this.llenarTablas("T_CEN", "listEmpresa");
												this.llenarTablas("" + this.varTableT_SERV_DETRACCION + "", "listServDetraccion");
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)

									});
									dialogA.open();
								}.bind(this),
								error: function (data) {
									this.getView().setBusy(false);
									var dialogA = new sap.m.Dialog({
										title: "Se ha generado un error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "No se registró el servicio de detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												dialogA.close();
											}
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
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

					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				},
				afterOpen: function () {
					var selects = [
						sap.ui.getCore().byId("idPri")
					];
					var firstItem;
					jQuery.each(selects, function (i, select) {
						select.getBinding("items").refresh(true);
						firstItem = select.getItems()[0];
						select.setSelectedItem(firstItem, true);
					});
				}.bind(this),
			});
			dialog2.open();
		},
		editarDetraccion: function (evt) {

			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			var varNumReg = objeto.NUMTP;
			var varDesReg = objeto.NTBEZ;
			var varPriReg = objeto.PRIORIDAD;

			var dialog2 = new sap.m.Dialog({
				title: 'Editar Detracción',
				icon: "sap-icon://document-text",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "600px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Número : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idNumero",
								placeholder: "Ingrese número (2)...",
								maxLength: 2,
								value: varNumReg,
								width: "70%",
								editable: false,
								liveChange: function (evt) {
									var valor = evt.getSource();
									var value = valor.getValue();
									var valor2 = value.replace(/[^\d]/g, '');
									valor.setValue(valor2);
								}
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Descripción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idDes",
								value: varDesReg,
								placeholder: "Ingrese descripción (200) ...",
								maxLength: 200,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Prioridad : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idPri",
								placeholder: "Ingrese prioridad (2) ...",
								maxLength: 2,
								width: "70%",
								value: varPriReg,
								editable: true,
								liveChange: function (evt) {
									var valor = evt.getSource();
									var value = valor.getValue();
									var valor2 = value.replace(/[^\d]/g, '');
									valor.setValue(valor2);
								}
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Actualizar',
					icon: "sap-icon://edit",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idDes"),
							sap.ui.getCore().byId("idPri")
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
							this.getView().setBusy(true);
							var llave = {};
							llave.NTBEZ = sap.ui.getCore().byId("idDes").getValue();
							llave.PRIORIDAD = sap.ui.getCore().byId("idPri").getValue();
							var descripcion = sap.ui.getCore().byId("idDes").getValue();
							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							//oModel.update("/T_CENs(RUC_EM='" + varRucReg + "')", llave, {
							oModel.update("/" + this.varTableT_DETRACCION + "(NUMTP='" + varNumReg + "')", llave, {
								method: "POST",
								success: function (data) {
									this.getView().setBusy(false);
									dialog2.close();
									var dialogA = new sap.m.Dialog({
										title: "Se editó con éxito",
										type: "Message",
										state: "Success",
										content: new sap.m.Text({
											text: "Se editó correctamente la detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												//this.llenarTablas("T_CEN", "listEmpresa");
												this.llenarTablas("" + this.varTableT_DETRACCION + "", "listDetraccion");
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)

									});
									dialogA.open();
								}.bind(this),
								error: function (data) {
									this.getView().setBusy(false);
									var dialogA = new sap.m.Dialog({
										title: "Se ha generado un error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "No se editó la detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												dialogA.close();
											}
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
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

					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		editarMatDetraccion: function (evt) {
			var model = this.getView().getModel("myParam");
			sap.ui.getCore().setModel(model);
			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			var varNumReg = objeto.NUMTP;
			var varDesReg = objeto.DE_DESCRIPCION;
			var varMatReg = objeto.DE_NUM_MATERIAL;

			var dialog2 = new sap.m.Dialog({
				title: 'Editar Material de detracción',
				icon: "sap-icon://course-program",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "600px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Número de material : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idNumero",
								placeholder: "Ingrese número (18)...",
								maxLength: 18,
								value: varMatReg,
								width: "70%",
								editable: false,
								liveChange: function (evt) {
									var valor = evt.getSource();
									var value = valor.getValue();
									var valor2 = value.replace(/[^\d]/g, '');
									valor.setValue(valor2);
								}
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Descripción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idDes",
								value: varDesReg,
								placeholder: "Ingrese descripción (200) ...",
								maxLength: 200,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "N° de detracción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.ComboBox({
								id: "idPri",
								valueStateText: "Se requiere seleccionar un n° de detacción.",
								placeholder: "Seleccione n° de detracción ...", // string
								items: {
									path: "/listDetraccion",
									template: new sap.ui.core.Item({
										key: "{NUMTP}",
										text: "{NUMTP} - {NTBEZ}"
									})
								},
								width: "70%"
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Actualizar',
					icon: "sap-icon://edit",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idDes")
						];
						var selects = [
							sap.ui.getCore().byId("idPri")
						];
						jQuery.each(selects, function (i, select) {
							if (!select.getSelectedItem()) {
								select.setValueState("Error");
								canContinue = false;
							} else {
								select.setValueState("None");
							}
						});
						jQuery.each(inputs, function (i, input) {
							if (!input.getValue()) {
								input.setValueState("Error");
								canContinue = false;
							} else {
								input.setValueState("None");
							}
						});
						if (canContinue) {
							this.getView().setBusy(true);
							var llave = {};
							llave.DE_DESCRIPCION = sap.ui.getCore().byId("idDes").getValue();
							llave.NUMTP = sap.ui.getCore().byId("idPri").getSelectedItem().getKey();
							var descripcion = sap.ui.getCore().byId("idDes").getValue();
							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							//oModel.update("/T_CENs(RUC_EM='" + varRucReg + "')", llave, {
							oModel.update("/" + this.varTableT_MAT_DETRACCION + "(DE_NUM_MATERIAL='" + varMatReg + "')", llave, {
								method: "POST",
								success: function (data) {
									this.getView().setBusy(false);
									dialog2.close();
									var dialogA = new sap.m.Dialog({
										title: "Se editó con éxito",
										type: "Message",
										state: "Success",
										content: new sap.m.Text({
											text: "Se editó correctamente la materia de detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												//this.llenarTablas("T_CEN", "listEmpresa");
												this.llenarTablas("" + this.varTableT_MAT_DETRACCION + "", "listMatDetraccion");
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)

									});
									dialogA.open();
								}.bind(this),
								error: function (data) {
									this.getView().setBusy(false);
									var dialogA = new sap.m.Dialog({
										title: "Se ha generado un error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "No se editó la materia de detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												dialogA.close();
											}
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
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

					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				},
				afterOpen: function () {
					var selects = [
						sap.ui.getCore().byId("idPri")
					];
					var firstItem;
					jQuery.each(selects, function (i, select) {
						select.getBinding("items").refresh(true);
						firstItem = select.getItems()[0];
						select.setSelectedItem(firstItem, true);
					});
					if (parseInt(varNumReg.toString()) < 10) {
						sap.ui.getCore().byId("idPri").setSelectedKey("0" + varNumReg);
					} else {
						sap.ui.getCore().byId("idPri").setSelectedKey(varNumReg);
					}

				}.bind(this)
			});
			dialog2.open();
		},
		editarServDetraccion: function (evt) {

			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var model = this.getView().getModel("myParam");
			sap.ui.getCore().setModel(model);
			var objeto = oContext.getObject();
			var varNumReg = objeto.NUMTP;
			var varDesReg = objeto.DE_DESCRIPCION;
			var varMatReg = objeto.DE_NUM_SERVICIO;

			//Begin I@MM-21/12/2021-Ticket-2021-999
			var selectedCheck03, selectedCheck04;
			if (objeto.FLAG2 === "X") {
				selectedCheck03 = true;
				selectedCheck04 = false;
			} else {
				selectedCheck03 = false;
				selectedCheck04 = true;
			}

			var checkBox03 = new sap.m.CheckBox({
				id: "idCheckBox03",
				text: "Activo",
				valueState: "Warning",
				selected: selectedCheck03,
				width: "200px",
				select: function (evt) {
					var key = evt.getSource().getSelected();
					if (key) {
						sap.ui.getCore().byId("idCheckBox04").setSelected(false);
					} else {
						sap.ui.getCore().byId("idCheckBox04").setSelected(true);
					}
				}
			});
			var checkBox04 = new sap.m.CheckBox({
				id: "idCheckBox04",
				text: "No Activo",
				valueState: "Warning",
				selected: selectedCheck04,
				width: "auto",
				select: function (evt) {
					var key = evt.getSource().getSelected();
					if (key) {
						sap.ui.getCore().byId("idCheckBox03").setSelected(false);
					} else {
						sap.ui.getCore().byId("idCheckBox03").setSelected(true);
					}
				}
			});
			//End I@MM-21/12/2021-Ticket-2021-999

			var dialog2 = new sap.m.Dialog({
				title: 'Editar Servicio de detracción',
				icon: "sap-icon://course-program",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "600px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Número de servicio : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idNumero",
								placeholder: "Ingrese número (18)...",
								maxLength: 18,
								value: varMatReg,
								width: "70%",
								editable: false,
								liveChange: function (evt) {
									var valor = evt.getSource();
									var value = valor.getValue();
									var valor2 = value.replace(/[^\d]/g, '');
									valor.setValue(valor2);
								}
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Descripción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idDes",
								value: varDesReg,
								placeholder: "Ingrese descripción (200) ...",
								maxLength: 200,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "N° de detracción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.ComboBox({
								id: "idPri",
								valueStateText: "Se requiere seleccionar un n° de detacción.",
								placeholder: "Seleccione n° de detracción ...", // string
								items: {
									path: "/listDetraccion",
									template: new sap.ui.core.Item({
										key: "{NUMTP}",
										text: "{NUMTP} - {NTBEZ}"
									})
								},
								width: "70%"
							})
						]
					}),
					//Begin I@MM-21/12/2021-Ticket-2021-999
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Estado : ",
								textAlign: "Right",
								width: "30%"
							}),
							checkBox03,
							checkBox04
						]
					}),
					//End I@MM-21/12/2021-Ticket-2021-999
				],
				beginButton: new sap.m.Button({
					text: 'Actualizar',
					icon: "sap-icon://edit",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idDes")
						];
						var selects = [
							sap.ui.getCore().byId("idPri")
						];
						jQuery.each(selects, function (i, select) {
							if (!select.getSelectedItem()) {
								select.setValueState("Error");
								canContinue = false;
							} else {
								select.setValueState("None");
							}
						});
						jQuery.each(inputs, function (i, input) {
							if (!input.getValue()) {
								input.setValueState("Error");
								canContinue = false;
							} else {
								input.setValueState("None");
							}
						});
						if (canContinue) {
							this.getView().setBusy(true);
							var llave = {};
							llave.DE_DESCRIPCION = sap.ui.getCore().byId("idDes").getValue();
							llave.NUMTP = sap.ui.getCore().byId("idPri").getSelectedItem().getKey();
							var box03 = checkBox03.getSelected();
							if (box03) {
								llave.FLAG2 = "X";
							} else {
								llave.FLAG2 = "";
							}
							var descripcion = sap.ui.getCore().byId("idDes").getValue();
							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							//oModel.update("/T_CENs(RUC_EM='" + varRucReg + "')", llave, {
							oModel.update("/" + this.varTableT_SERV_DETRACCION + "(DE_NUM_SERVICIO='" + varMatReg + "')", llave, {
								method: "POST",
								success: function (data) {
									this.getView().setBusy(false);
									dialog2.close();
									var dialogA = new sap.m.Dialog({
										title: "Se editó con éxito",
										type: "Message",
										state: "Success",
										content: new sap.m.Text({
											text: "Se editó correctamente el servicio de detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												//this.llenarTablas("T_CEN", "listEmpresa");
												this.llenarTablas("" + this.varTableT_SERV_DETRACCION + "", "listServDetraccion");
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)

									});
									dialogA.open();
								}.bind(this),
								error: function (data) {
									this.getView().setBusy(false);
									var dialogA = new sap.m.Dialog({
										title: "Se ha generado un error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "No se editó el servicio de detracción " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												dialogA.close();
											}
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
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

					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				},
				afterOpen: function () {
					var selects = [
						sap.ui.getCore().byId("idPri")
					];
					var firstItem;
					jQuery.each(selects, function (i, select) {
						select.getBinding("items").refresh(true);
						firstItem = select.getItems()[0];
						select.setSelectedItem(firstItem, true);
					});
					if (parseInt(varNumReg.toString()) < 10) {
						sap.ui.getCore().byId("idPri").setSelectedKey("0" + varNumReg);
					} else {
						sap.ui.getCore().byId("idPri").setSelectedKey(varNumReg);
					}

				}.bind(this)
			});
			dialog2.open();
		},
		eliminarDetraccion: function (evt) {

			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			var varNumReg = objeto.NUMTP;
			var varDesReg = objeto.NTBEZ;

			var dialog2 = new sap.m.Dialog({
				title: 'Eliminar Detracción',
				icon: "sap-icon://factory",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "auto",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
							text: "Desea eliminar la detracción " + varNumReg + " - " + varDesReg,
							textAlign: "Center",
							width: "100%"
						})]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Eliminar',
					icon: "sap-icon://delete",
					press: function () {
						this.getView().setBusy(true);
						//var url = "/odatabnv/odata2.svc/";
						var url = "" + this.varTableURL + "/";
						var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
						//oModel.remove("/T_CENs(RUC_EM='" + varRucReg + "')", {
						oModel.remove("/" + this.varTableT_DETRACCION + "(NUMTP='" + varNumReg + "')", {
							method: "POST",
							success: function (data) {
								this.getView().setBusy(false);
								dialog2.close();
								var dialogA = new sap.m.Dialog({
									title: "Se eliminó con éxito",
									type: "Message",
									state: "Success",
									content: new sap.m.Text({
										text: "Se eliminó correctamente la detracción " + varNumReg + " - " + varDesReg + "."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Accept",
										press: function () {
											//this.llenarTablas("T_CEN", "listEmpresa");
											this.llenarTablas("" + this.varTableT_DETRACCION + "", "listDetraccion");
											dialogA.close();
										}.bind(this)
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)

								});
								dialogA.open();
							}.bind(this),
							error: function (data) {
								this.getView().setBusy(false);
								var dialogA = new sap.m.Dialog({
									title: "Se ha generado un error",
									type: "Message",
									state: "Error",
									content: new sap.m.Text({
										text: "No se eliminó la detracción " + varDesReg + "."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Accept",
										press: function () {
											dialogA.close();
										}
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)
								});
								dialogA.open();
							}.bind(this)
						});
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		eliminarMatDetraccion: function (evt) {

			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			var varNumReg = objeto.DE_NUM_MATERIAL;
			var varDesReg = objeto.DE_DESCRIPCION;

			var dialog2 = new sap.m.Dialog({
				title: 'Eliminar Materia de detracción',
				icon: "sap-icon://factory",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "auto",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
							text: "Desea eliminar la materia de detracción " + varNumReg + " - " + varDesReg,
							textAlign: "Center",
							width: "100%"
						})]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Eliminar',
					icon: "sap-icon://delete",
					press: function () {
						this.getView().setBusy(true);
						//var url = "/odatabnv/odata2.svc/";
						var url = "" + this.varTableURL + "/";
						var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
						//oModel.remove("/T_CENs(RUC_EM='" + varRucReg + "')", {
						oModel.remove("/" + this.varTableT_MAT_DETRACCION + "(DE_NUM_MATERIAL='" + varNumReg + "')", {
							method: "POST",
							success: function (data) {
								this.getView().setBusy(false);
								dialog2.close();
								var dialogA = new sap.m.Dialog({
									title: "Se eliminó con éxito",
									type: "Message",
									state: "Success",
									content: new sap.m.Text({
										text: "Se eliminó correctamente la detracción " + varNumReg + " - " + varDesReg + "."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Accept",
										press: function () {
											//this.llenarTablas("T_CEN", "listEmpresa");
											this.llenarTablas("" + this.varTableT_MAT_DETRACCION + "", "listMatDetraccion");
											dialogA.close();
										}.bind(this)
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)

								});
								dialogA.open();
							}.bind(this),
							error: function (data) {
								this.getView().setBusy(false);
								var dialogA = new sap.m.Dialog({
									title: "Se ha generado un error",
									type: "Message",
									state: "Error",
									content: new sap.m.Text({
										text: "No se eliminó la materia de detracción " + varDesReg + "."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Accept",
										press: function () {
											dialogA.close();
										}
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)
								});
								dialogA.open();
							}.bind(this)
						});
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		eliminarServDetraccion: function (evt) {

			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			var varNumReg = objeto.DE_NUM_SERVICIO;
			var varDesReg = objeto.DE_DESCRIPCION;

			var dialog2 = new sap.m.Dialog({
				title: 'Eliminar Servicio de detracción',
				icon: "sap-icon://factory",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "auto",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
							text: "Desea eliminar el servicio de detracción " + varNumReg + " - " + varDesReg,
							textAlign: "Center",
							width: "100%"
						})]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Eliminar',
					icon: "sap-icon://delete",
					press: function () {
						this.getView().setBusy(true);
						//var url = "/odatabnv/odata2.svc/";
						var url = "" + this.varTableURL + "/";
						var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
						//oModel.remove("/T_CENs(RUC_EM='" + varRucReg + "')", {
						oModel.remove("/" + this.varTableT_SERV_DETRACCION + "(DE_NUM_SERVICIO='" + varNumReg + "')", {
							method: "POST",
							success: function (data) {
								this.getView().setBusy(false);
								dialog2.close();
								var dialogA = new sap.m.Dialog({
									title: "Se eliminó con éxito",
									type: "Message",
									state: "Success",
									content: new sap.m.Text({
										text: "Se eliminó correctamente la materia de detracción " + varNumReg + " - " + varDesReg + "."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Accept",
										press: function () {
											//this.llenarTablas("T_CEN", "listEmpresa");
											this.llenarTablas("" + this.varTableT_SERV_DETRACCION + "", "listServDetraccion");
											dialogA.close();
										}.bind(this)
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)

								});
								dialogA.open();
							}.bind(this),
							error: function (data) {
								this.getView().setBusy(false);
								var dialogA = new sap.m.Dialog({
									title: "Se ha generado un error",
									type: "Message",
									state: "Error",
									content: new sap.m.Text({
										text: "No se eliminó el servicio de detracción " + varDesReg + "."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Accept",
										press: function () {
											dialogA.close();
										}
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)
								});
								dialogA.open();
							}.bind(this)
						});
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		btnInicio: function () {
			this.getRouter().navTo("Vista_Menu_Principal");
			this.getView().byId("idChaeckAdministrador").setSelected(false);
			this.getView().byId("idChaeckEstandar").setSelected(false);
			this.getView().byId("idTxtRuc").setValue("");
		},
		llenarTablas: function (tabla, json) {
			this.getView().setBusy(true);
			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);
			var oModel = this.getView().getModel("myParam");
			oModelOData.read("/" + tabla + "?$format=json", {
				success: function (response) {
					try {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						var vector = [];
						var llave = {};
						for (var i = 0; i < tamTabla; i++) {
							llave = {};
							llave = oModelJSON.getData()[i];
							llave.selectItem = false;
							vector.push(llave);
						}
						oModel.setProperty("/" + json, vector);
					} catch (err) {
						if (tabla === "T_EMPRESA_EMP") {
							oModel.setProperty("/empresaCombo", []);
						}
						oModel.setProperty("/" + json, []);
					}
					this.getView().byId("idTableUser").getBinding("rows").refresh(true);
					this.getView().setBusy(false);
				}.bind(this),
				error: function (oError) {
					if (tabla === "T_EMPRESA_EMP") {
						oModel.setProperty("/empresaCombo", []);
					}
					oModel.setProperty("/" + json, []);
					this.getView().byId("idTableUser").getBinding("rows").refresh(true);
					this.getView().setBusy(false);
					// Mensaje de Alerta de que termino el tiempo de sesión
					var dialogMensajeSesion = new sap.m.Dialog({
						draggable: true,
						resizable: true,
						contentWidth: "auto",
						title: "Mensaje de alerta",
						content: [
							new sap.m.Label({
								text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactarse con el área de TI.",
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
		formatTipoCheck1: function (tipo) {
			if (tipo === "ADMIN") {
				return true;
			} else {
				return false;
			}
		},
		formatNombreServicio: function (servicio) {
			if (servicio === "Validacion_CPE_SUNAT") {
				return "Validación CPE SUNAT";
			} else if (servicio === "Validacion_porcentaje_tolerancia") {
				return "Validación porcentaje de tolerancia";
			} else if (servicio === "Validacion_dias_habiles") {
				return "Validación dias hábiles";
			} else if (servicio === "Descarga_total_de_facturas") {
				return "Descarga total de facturas";
			} else if (servicio === "Validacion_reporte01") {
				return "Resumen de facturas registradas";
			} else if (servicio === "Validacion_reporte02") {
				return "Reporte de suministros/HES";
			} else if (servicio === "Validacion_dias_calendario") { //I@MM-16/12/2021-Ticket-2021-999
				return "Validación días calendario";
			} else {
				return servicio;
			}
		},
		formatTipoCheck2: function (tipo) {
			if (tipo === "ESTAN") {
				return true;
			} else {
				return false;
			}
		},
		formatTipoCheck3: function (tipo) {
			if (tipo === "AVANZ") {
				return true;
			} else {
				return false;
			}
		},
		txtVisibleForm: function (check) {
			if (check !== null && check !== undefined && check !== "") {
				if (check === "x") {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		formatoEstadoSunatText: function (est) {
			if (est === "X") {
				return "Habilitado";
			} else {
				return "Inhabilitado";
			}
		},
		formatoEstadoSunatType: function (est) {
			if (est === "X") {
				return 8;
			} else {
				return 3;
			}
		},
		updateServicioSunat: function () {
			var url = "" + this.varTableURL + "/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("SERVICIO", sap.ui.model.FilterOperator.EQ, "Validacion_CPE_SUNAT");
			filters.push(filter);
			oModel.read("/" + this.varTableT_SERVICIOS + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					if (lenghtV !== 0) {
						if (oModelJSON.getData()[0].ESTADO === "X") {} else {}
					}
				}.bind(this),
				error: function (oError) {}.bind(this)
			});
		},
		updateServicioDiaHabil: function () {
			var url = "" + this.varTableURL + "/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("SERVICIO", sap.ui.model.FilterOperator.EQ, "Validacion_dias_habiles");
			filters.push(filter);
			oModel.read("/" + this.varTableT_SERVICIOS + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					if (lenghtV !== 0) {
						if (oModelJSON.getData()[0].ESTADO === "X") {} else {}
					}
				}.bind(this),
				error: function (oError) {}.bind(this)
			});
		},
		pressActualizarServicio: function (evt) {
			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			var url = "" + this.varTableURL + "/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			if (objeto.SERVICIO === "Validacion_CPE_SUNAT") {
				if (objeto.ESTADO === "X") {
					var dialogA = new sap.m.Dialog({
						title: "Mensaje de confirmación",
						type: "Message",
						state: "Success",
						content: new sap.m.Text({
							text: "¿Está seguro de inhabilitar el servicio?."
						}),
						beginButton: new sap.m.Button({
							text: "OK",
							type: "Accept",
							press: function () {
								var llaveActualizar = {};
								llaveActualizar.ESTADO = "";
								var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
								oModel.update(texto, llaveActualizar, {
									method: "PUT",
									success: function (data) {
										this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
										dialogA.close();
									}.bind(this),
									error: function (data) {
										this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
										dialogA.close();
									}.bind(this)
								});
							}.bind(this)
						}),
						endButton: new sap.m.Button({
							icon: "sap-icon://cancel",
							text: "Cancelar",
							type: "Accept",
							press: function () {
								dialogA.close();
							}
						}),
						afterClose: function (response) {
							dialogA.destroy();
						}.bind(this)
					});
					dialogA.open();
				} else {
					var dialogA = new sap.m.Dialog({
						title: "Mensaje de confirmación",
						type: "Message",
						state: "Success",
						content: new sap.m.Text({
							text: "¿Está seguro de habilitar el servicio?."
						}),
						beginButton: new sap.m.Button({
							text: "OK",
							type: "Accept",
							press: function () {
								var llaveActualizar = {};
								llaveActualizar.ESTADO = "X";
								var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
								oModel.update(texto, llaveActualizar, {
									method: "PUT",
									success: function (data) {
										this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
										dialogA.close();
									}.bind(this),
									error: function (data) {
										this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
										dialogA.close();
									}.bind(this)
								});
							}.bind(this)
						}),
						endButton: new sap.m.Button({
							icon: "sap-icon://cancel",
							text: "Cancelar",
							type: "Accept",
							press: function () {
								dialogA.close();
							}
						}),
						afterClose: function (response) {
							dialogA.destroy();
						}.bind(this)
					});
					dialogA.open();
				}
			} else if (objeto.SERVICIO === "Validacion_dias_habiles") {
				if (objeto.ESTADO === "X") {
					var dialogA = new sap.m.Dialog({
						title: "Mensaje de confirmación",
						type: "Message",
						state: "Success",
						content: [
							new sap.m.Toolbar({
								height: "auto",
								width: "100%",
								content: [new sap.m.Label({
										text: "Días hábiles : ",
										textAlign: "Right",
										width: "50%"
									}),
									new sap.m.Input({
										id: "idDias",
										value: objeto.CAMPO1,
										width: "50%",
										type: "Number",
										editable: true
									})
								]
							}),
							new sap.m.Label({
								text: " ",
								textAlign: "Right",
								width: "100%"
							}),
							new sap.m.ToolbarSpacer({}),
							new sap.m.Toolbar({
								height: "auto",
								width: "100%",
								content: [new sap.m.Button({
										type: "Accept",
										text: "Actualizar días hábiles",
										icon: "sap-icon://refresh",
										visible: true,
										enabled: true,
										press: function () {
											var inputs = [
												sap.ui.getCore().byId("idDias")
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
												if (sap.ui.getCore().byId("idDias").getValue() !== "0") {
													var llaveActualizar = {};
													llaveActualizar.CAMPO1 = sap.ui.getCore().byId("idDias").getValue();
													var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
													oModel.update(texto, llaveActualizar, {
														method: "PUT",
														success: function (data) {
															this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
															dialogA.close();
														}.bind(this),
														error: function (data) {
															this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
															dialogA.close();
														}.bind(this)
													});
												} else {
													var dialog55 = new sap.m.Dialog({
														title: "Alerta",
														type: "Message",
														state: "Warning",
														content: new sap.m.Text({
															text: "Se requiere ingresar un valor diferente de 0."
														}),
														beginButton: new sap.m.Button({
															text: "OK",
															press: function () {
																dialog55.close();
																dialog55.destroy();
															}
														}),
														afterClose: function () {
															dialog55.destroy();
														}
													});
													dialog55.open();
												}
											} else {
												var dialog55 = new sap.m.Dialog({
													title: "Alerta",
													type: "Message",
													state: "Warning",
													content: new sap.m.Text({
														text: "Se requiere ingresar un valor numerico."
													}),
													beginButton: new sap.m.Button({
														text: "OK",
														press: function () {
															dialog55.close();
															dialog55.destroy();
														}
													}),
													afterClose: function () {
														dialog55.destroy();
													}
												});
												dialog55.open();
											}
										}.bind(this)
									}),
									new sap.m.ToolbarSpacer({}),
									new sap.m.Button({
										type: "Accept",
										text: "Inhabilitar / Habilitar",
										icon: "sap-icon://accept",
										visible: true,
										press: function () {
											var llaveActualizar = {};
											llaveActualizar.ESTADO = "";
											var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
											oModel.update(texto, llaveActualizar, {
												method: "PUT",
												success: function (data) {
													this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
													dialogA.close();
												}.bind(this),
												error: function (data) {
													this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
													dialogA.close();
												}.bind(this)
											});
										}.bind(this)
									})
								]
							})
						],
						endButton: new sap.m.Button({
							icon: "sap-icon://cancel",
							text: "Cancelar",
							type: "Accept",
							press: function () {
								dialogA.close();
							}
						}),
						afterClose: function (response) {
							dialogA.destroy();
						}.bind(this)
					});
					dialogA.open();
				} else if (objeto.ESTADO === "") {
					var dialogA = new sap.m.Dialog({
						title: "Mensaje de confirmación",
						type: "Message",
						state: "Success",
						content: [
							new sap.m.Toolbar({
								height: "auto",
								width: "100%",
								content: [new sap.m.Label({
										text: "Días hábiles : ",
										textAlign: "Right",
										width: "50%"
									}),
									new sap.m.Input({
										id: "idUsuario",
										value: objeto.CAMPO1,
										width: "50%",
										editable: false
									})
								]
							}),
							new sap.m.Label({
								text: " ",
								textAlign: "Right",
								width: "100%"
							}),
							new sap.m.ToolbarSpacer({}),
							new sap.m.Toolbar({
								height: "auto",
								width: "100%",
								content: [new sap.m.Button({
										type: "Accept",
										text: "Actualizar días hábiles",
										icon: "sap-icon://refresh",
										visible: true,
										enabled: false,
										press: function () {}.bind(this)
									}),
									new sap.m.ToolbarSpacer({}),
									new sap.m.Button({
										type: "Accept",
										text: "Inhabilitar / Habilitar",
										icon: "sap-icon://accept",
										visible: true,
										press: function () {
											var llaveActualizar = {};
											llaveActualizar.ESTADO = "X";
											var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
											oModel.update(texto, llaveActualizar, {
												method: "PUT",
												success: function (data) {
													this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
													dialogA.close();
												}.bind(this),
												error: function (data) {
													this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
													dialogA.close();
												}.bind(this)
											});
										}.bind(this)
									})
								]
							})
						],
						endButton: new sap.m.Button({
							icon: "sap-icon://cancel",
							text: "Cancelar",
							type: "Accept",
							press: function () {
								dialogA.close();
							}
						}),
						afterClose: function (response) {
							dialogA.destroy();
						}.bind(this)
					});
					dialogA.open();
				}
			} else if (objeto.SERVICIO === "Validacion_porcentaje_tolerancia") {
				var dialogA = new sap.m.Dialog({
					title: "Mensaje de confirmación",
					type: "Message",
					state: "Success",
					content: [
						new sap.m.Toolbar({
							height: "auto",
							width: "100%",
							content: [new sap.m.Label({
									text: "Porcentaje de tolerancia : ",
									textAlign: "Right",
									width: "50%"
								}),
								new sap.m.Input({
									id: "idTolerancia",
									value: objeto.CAMPO1,
									width: "50%",
									type: "Number",
									editable: true
								})
							]
						})
					],
					beginButton: new sap.m.Button({
						text: "Actualizar",
						type: "Accept",
						press: function () {
							var inputs = [
								sap.ui.getCore().byId("idTolerancia")
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
								var llaveActualizar = {};
								llaveActualizar.CAMPO1 = sap.ui.getCore().byId("idTolerancia").getValue();
								var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
								oModel.update(texto, llaveActualizar, {
									method: "PUT",
									success: function (data) {
										this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
										dialogA.close();
									}.bind(this),
									error: function (data) {
										this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
										dialogA.close();
									}.bind(this)
								});
							} else {
								var dialog55 = new sap.m.Dialog({
									title: "Alerta",
									type: "Message",
									state: "Warning",
									content: new sap.m.Text({
										text: "Se requiere ingresar un valor numerico."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										press: function () {
											dialog55.close();
											dialog55.destroy();
										}
									}),
									afterClose: function () {
										dialog55.destroy();
									}
								});
								dialog55.open();
							}
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						icon: "sap-icon://cancel",
						text: "Cancelar",
						type: "Accept",
						press: function () {
							dialogA.close();
						}
					}),
					afterClose: function (response) {
						dialogA.destroy();
					}.bind(this)
				});
				dialogA.open();
			} else if (objeto.SERVICIO === "Validacion_dias_calendario") { //I@MM-16/12/2021-Ticket-2021-999
				if (objeto.ESTADO === "X") {
					var dialogA = new sap.m.Dialog({
						title: "Mensaje de confirmación",
						type: "Message",
						state: "Success",
						content: [
							new sap.m.Toolbar({
								height: "auto",
								width: "100%",
								content: [new sap.m.Label({
										text: "Días hábiles : ",
										textAlign: "Right",
										width: "50%"
									}),
									new sap.m.Input({
										id: "idDias",
										value: objeto.CAMPO1,
										width: "50%",
										type: "Number",
										editable: true
									})
								]
							}),
							new sap.m.Label({
								text: " ",
								textAlign: "Right",
								width: "100%"
							}),
							new sap.m.ToolbarSpacer({}),
							new sap.m.Toolbar({
								height: "auto",
								width: "100%",
								content: [new sap.m.Button({
										type: "Accept",
										text: "Actualizar días hábiles",
										icon: "sap-icon://refresh",
										visible: true,
										enabled: true,
										press: function () {
											var inputs = [
												sap.ui.getCore().byId("idDias")
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
												if (sap.ui.getCore().byId("idDias").getValue() !== "0") {
													var llaveActualizar = {};
													llaveActualizar.CAMPO1 = sap.ui.getCore().byId("idDias").getValue();
													var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
													oModel.update(texto, llaveActualizar, {
														method: "PUT",
														success: function (data) {
															this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
															dialogA.close();
														}.bind(this),
														error: function (data) {
															this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
															dialogA.close();
														}.bind(this)
													});
												} else {
													var dialog55 = new sap.m.Dialog({
														title: "Alerta",
														type: "Message",
														state: "Warning",
														content: new sap.m.Text({
															text: "Se requiere ingresar un valor diferente de 0."
														}),
														beginButton: new sap.m.Button({
															text: "OK",
															press: function () {
																dialog55.close();
																dialog55.destroy();
															}
														}),
														afterClose: function () {
															dialog55.destroy();
														}
													});
													dialog55.open();
												}
											} else {
												var dialog55 = new sap.m.Dialog({
													title: "Alerta",
													type: "Message",
													state: "Warning",
													content: new sap.m.Text({
														text: "Se requiere ingresar un valor numerico."
													}),
													beginButton: new sap.m.Button({
														text: "OK",
														press: function () {
															dialog55.close();
															dialog55.destroy();
														}
													}),
													afterClose: function () {
														dialog55.destroy();
													}
												});
												dialog55.open();
											}
										}.bind(this)
									}),
									new sap.m.ToolbarSpacer({}),
									new sap.m.Button({
										type: "Accept",
										text: "Inhabilitar / Habilitar",
										icon: "sap-icon://accept",
										visible: true,
										press: function () {
											var llaveActualizar = {};
											llaveActualizar.ESTADO = "";
											var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
											oModel.update(texto, llaveActualizar, {
												method: "PUT",
												success: function (data) {
													this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
													dialogA.close();
												}.bind(this),
												error: function (data) {
													this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
													dialogA.close();
												}.bind(this)
											});
										}.bind(this)
									})
								]
							})
						],
						endButton: new sap.m.Button({
							icon: "sap-icon://cancel",
							text: "Cancelar",
							type: "Accept",
							press: function () {
								dialogA.close();
							}
						}),
						afterClose: function (response) {
							dialogA.destroy();
						}.bind(this)
					});
					dialogA.open();
				} else if (objeto.ESTADO === "") {
					var dialogA = new sap.m.Dialog({
						title: "Mensaje de confirmación",
						type: "Message",
						state: "Success",
						content: [
							new sap.m.Toolbar({
								height: "auto",
								width: "100%",
								content: [new sap.m.Label({
										text: "Días hábiles : ",
										textAlign: "Right",
										width: "50%"
									}),
									new sap.m.Input({
										id: "idUsuario",
										value: objeto.CAMPO1,
										width: "50%",
										editable: false
									})
								]
							}),
							new sap.m.Label({
								text: " ",
								textAlign: "Right",
								width: "100%"
							}),
							new sap.m.ToolbarSpacer({}),
							new sap.m.Toolbar({
								height: "auto",
								width: "100%",
								content: [new sap.m.Button({
										type: "Accept",
										text: "Actualizar días hábiles",
										icon: "sap-icon://refresh",
										visible: true,
										enabled: false,
										press: function () {}.bind(this)
									}),
									new sap.m.ToolbarSpacer({}),
									new sap.m.Button({
										type: "Accept",
										text: "Inhabilitar / Habilitar",
										icon: "sap-icon://accept",
										visible: true,
										press: function () {
											var llaveActualizar = {};
											llaveActualizar.ESTADO = "X";
											var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
											oModel.update(texto, llaveActualizar, {
												method: "PUT",
												success: function (data) {
													this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
													dialogA.close();
												}.bind(this),
												error: function (data) {
													this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
													dialogA.close();
												}.bind(this)
											});
										}.bind(this)
									})
								]
							})
						],
						endButton: new sap.m.Button({
							icon: "sap-icon://cancel",
							text: "Cancelar",
							type: "Accept",
							press: function () {
								dialogA.close();
							}
						}),
						afterClose: function (response) {
							dialogA.destroy();
						}.bind(this)
					});
					dialogA.open();
				}
			} else if (objeto.SERVICIO === "Descarga_total_de_facturas") {
				this.btnDescargarFacturasTotal();
			} else if (objeto.SERVICIO === "Validacion_reporte01" || objeto.SERVICIO === "Validacion_reporte02") {
				var dialogA = new sap.m.Dialog({
					title: "Mensaje de confirmación",
					type: "Message",
					state: "Success",
					content: [
						new sap.m.Toolbar({
							height: "auto",
							width: "100%",
							content: [new sap.m.Label({
									text: "Cantidad de dias por defecto: ",
									textAlign: "Right",
									width: "55%"
								}),
								new sap.m.Input({
									id: "idTolerancia",
									value: objeto.CAMPO1,
									width: "45%",
									type: "Number",
									editable: true
								})
							]
						})
					],
					beginButton: new sap.m.Button({
						text: "Actualizar",
						type: "Accept",
						press: function () {
							var inputs = [
								sap.ui.getCore().byId("idTolerancia")
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
								var llaveActualizar = {};
								llaveActualizar.CAMPO1 = sap.ui.getCore().byId("idTolerancia").getValue();
								var texto = "/" + this.varTableT_SERVICIOS + "(SERVICIO='" + objeto.SERVICIO + "')";
								oModel.update(texto, llaveActualizar, {
									method: "PUT",
									success: function (data) {
										this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
										dialogA.close();
									}.bind(this),
									error: function (data) {
										this.llenarTablas("" + this.varTableT_SERVICIOS + "", "listServicios");
										dialogA.close();
									}.bind(this)
								});
							} else {
								var dialog55 = new sap.m.Dialog({
									title: "Alerta",
									type: "Message",
									state: "Warning",
									content: new sap.m.Text({
										text: "Se requiere ingresar un valor numerico."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										press: function () {
											dialog55.close();
											dialog55.destroy();
										}
									}),
									afterClose: function () {
										dialog55.destroy();
									}
								});
								dialog55.open();
							}
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						icon: "sap-icon://cancel",
						text: "Cancelar",
						type: "Accept",
						press: function () {
							dialogA.close();
						}
					}),
					afterClose: function (response) {
						dialogA.destroy();
					}.bind(this)
				});
				dialogA.open();
			}
		},
		editarUsuario: function (evt) {
			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			this.opcAS = 0;
			var selectedSeccion01;
			var selectedSeccion02;
			var selectedSeccion03;
			var selectedSeccion04;
			var selectedSeccion05;
			var selectedSeccion06;
			var selectedSeccion07;
			var selectedSeccion08;
			if (objeto.SEC_1 === "") {
				selectedSeccion01 = "idOcultar";
			} else {
				selectedSeccion01 = "idMostrar";
			}
			if (objeto.SEC_2 === "") {
				selectedSeccion02 = "idOcultar";
			} else {
				selectedSeccion02 = "idMostrar";
			}
			if (objeto.SEC_3 === "") {
				selectedSeccion03 = "idOcultar";
			} else {
				selectedSeccion03 = "idMostrar";
			}
			if (objeto.SEC_4 === "") {
				selectedSeccion04 = "idOcultar";
			} else {
				selectedSeccion04 = "idMostrar";
			}
			if (objeto.SEC_5 === "") {
				selectedSeccion05 = "idOcultar";
			} else {
				selectedSeccion05 = "idMostrar";
			}
			if (objeto.SEC_6 === "") {
				selectedSeccion06 = "idOcultar";
			} else {
				selectedSeccion06 = "idMostrar";
			}
			if (objeto.SEC_7 === "") {
				selectedSeccion07 = "idOcultar";
			} else {
				selectedSeccion07 = "idMostrar";
			}
			if (objeto.SEC_8 === "") {
				selectedSeccion08 = "idOcultar";
			} else {
				selectedSeccion08 = "idMostrar";
			}
			var selectedCheck01, selectedCheck02, selectedCheck0A;
			if (objeto.AUTORIZACION === "ADMIN") {
				selectedCheck01 = true;
				selectedCheck02 = false;
				selectedCheck0A = false;
			} else if (objeto.AUTORIZACION === "ESTAN") {
				selectedCheck01 = false;
				selectedCheck02 = true;
				selectedCheck0A = false;
			} else {
				selectedCheck01 = false;
				selectedCheck02 = false;
				selectedCheck0A = true;
			}
			var selectedCheck03, selectedCheck04;
			if (objeto.ESTADO === "a") {
				selectedCheck03 = true;
				selectedCheck04 = false;
			} else {
				selectedCheck03 = false;
				selectedCheck04 = true;
			}
			var checkBox01 = new sap.m.CheckBox({
				id: "idCheckBox01",
				text: "Administrador",
				valueState: "Warning",
				selected: selectedCheck01,
				width: "200px",
				select: function (evt) {
					var key = evt.getSource().getSelected();
					var checkBox02 = sap.ui.getCore().byId("idCheckBox02").getSelected();
					var checkBox0A = sap.ui.getCore().byId("idCheckBox0A").getSelected();
					if (key) {
						sap.ui.getCore().byId("idCheckBox02").setSelected(false);
						sap.ui.getCore().byId("idCheckBox0A").setSelected(false);
					} else {
						if (!checkBox02 && !checkBox0A) {
							sap.ui.getCore().byId("idCheckBox01").setSelected(true);
						}
					}
				}
			});
			var checkBox02 = new sap.m.CheckBox({
				id: "idCheckBox02",
				text: "Estándar",
				valueState: "Warning",
				selected: selectedCheck02,
				width: "auto",
				select: function (evt) {
					var key = evt.getSource().getSelected();
					var checkBox01 = sap.ui.getCore().byId("idCheckBox01").getSelected();
					var checkBox0A = sap.ui.getCore().byId("idCheckBox0A").getSelected();
					if (key) {
						sap.ui.getCore().byId("idCheckBox01").setSelected(false);
						sap.ui.getCore().byId("idCheckBox0A").setSelected(false);
					} else {
						if (!checkBox01 && !checkBox0A) {
							sap.ui.getCore().byId("idCheckBox02").setSelected(true);
						}
					}
				}
			});
			var checkBox0A = new sap.m.CheckBox({
				id: "idCheckBox0A",
				text: "Avanzado",
				valueState: "Warning",
				selected: selectedCheck0A,
				width: "auto",
				select: function (evt) {
					var key = evt.getSource().getSelected();
					var checkBox02 = sap.ui.getCore().byId("idCheckBox02").getSelected();
					var checkBox01 = sap.ui.getCore().byId("idCheckBox01").getSelected();
					if (key) {
						sap.ui.getCore().byId("idCheckBox02").setSelected(false);
						sap.ui.getCore().byId("idCheckBox01").setSelected(false);
					} else {
						if (!checkBox02 && !checkBox01) {
							sap.ui.getCore().byId("idCheckBox0A").setSelected(true);
						}
					}
				}
			});
			var checkBox03 = new sap.m.CheckBox({
				id: "idCheckBox03",
				text: "Activo",
				valueState: "Warning",
				selected: selectedCheck03,
				width: "200px",
				select: function (evt) {
					var key = evt.getSource().getSelected();
					if (key) {
						sap.ui.getCore().byId("idCheckBox04").setSelected(false);
					} else {
						sap.ui.getCore().byId("idCheckBox04").setSelected(true);
					}
				}
			});
			var checkBox04 = new sap.m.CheckBox({
				id: "idCheckBox04",
				text: "No Activo",
				valueState: "Warning",
				selected: selectedCheck04,
				width: "auto",
				select: function (evt) {
					var key = evt.getSource().getSelected();
					if (key) {
						sap.ui.getCore().byId("idCheckBox03").setSelected(false);
					} else {
						sap.ui.getCore().byId("idCheckBox03").setSelected(true);
					}
				}
			});
			var buttonSeccion1 = new sap.m.SegmentedButton({
				selectedKey: selectedSeccion01,
				width: "70%"
			});
			var buttonSeccion2 = new sap.m.SegmentedButton({
				selectedKey: selectedSeccion02,
				width: "70%"
			});
			var buttonSeccion3 = new sap.m.SegmentedButton({
				selectedKey: selectedSeccion03,
				width: "70%"
			});
			var buttonSeccion4 = new sap.m.SegmentedButton({
				selectedKey: selectedSeccion04,
				width: "70%"
			});
			var buttonSeccion5 = new sap.m.SegmentedButton({
				selectedKey: selectedSeccion05,
				width: "70%"
			});
			var buttonSeccion6 = new sap.m.SegmentedButton({
				selectedKey: selectedSeccion06,
				width: "70%"
			});
			var buttonSeccion7 = new sap.m.SegmentedButton({
				selectedKey: selectedSeccion07,
				width: "70%"
			});
			var buttonSeccion8 = new sap.m.SegmentedButton({
				selectedKey: selectedSeccion08,
				width: "70%"
			});
			var item = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://show",
				text: "Mostrar",
				key: "idMostrar"
			});
			var item2 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://show",
				text: "Mostrar",
				key: "idMostrar"
			});
			var item3 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://show",
				text: "Mostrar",
				key: "idMostrar"
			});
			var item4 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://show",
				text: "Mostrar",
				key: "idMostrar"
			});
			var item5 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://show",
				text: "Mostrar",
				key: "idMostrar"
			});
			var item6 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://show",
				text: "Mostrar",
				key: "idMostrar"
			});
			var item7 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://show",
				text: "Mostrar",
				key: "idMostrar"
			});
			var item8 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://show",
				text: "Mostrar",
				key: "idMostrar"
			});
			buttonSeccion1.addItem(item);
			buttonSeccion2.addItem(item2);
			buttonSeccion3.addItem(item3);
			buttonSeccion4.addItem(item4);
			buttonSeccion5.addItem(item5);
			buttonSeccion6.addItem(item6);
			buttonSeccion7.addItem(item7);
			buttonSeccion8.addItem(item8);
			item = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://hide",
				text: "Ocultar",
				key: "idOcultar"
			});
			item2 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://hide",
				text: "Ocultar",
				key: "idOcultar"
			});
			item3 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://hide",
				text: "Ocultar",
				key: "idOcultar"
			});
			item4 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://hide",
				text: "Ocultar",
				key: "idOcultar"
			});
			item5 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://hide",
				text: "Ocultar",
				key: "idOcultar"
			});
			item6 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://hide",
				text: "Ocultar",
				key: "idOcultar"
			});
			item7 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://hide",
				text: "Ocultar",
				key: "idOcultar"
			});
			item8 = new sap.m.SegmentedButtonItem({
				icon: "sap-icon://hide",
				text: "Ocultar",
				key: "idOcultar"
			});
			buttonSeccion1.addItem(item);
			buttonSeccion2.addItem(item2);
			buttonSeccion3.addItem(item3);
			buttonSeccion4.addItem(item4);
			buttonSeccion5.addItem(item5);
			buttonSeccion6.addItem(item6);
			buttonSeccion7.addItem(item7);
			buttonSeccion8.addItem(item8);
			var dialog2 = new sap.m.Dialog({
				title: 'Editar usuario',
				icon: "sap-icon://user-edit",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "750px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Usuario : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idUsuario",
								value: objeto.US_USUARIO,
								width: "70%",
								editable: false
							})
						]
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Nombre : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idNombre",
								value: objeto.NOM_USUARIO,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Email : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idCorreo",
								value: objeto.EMAIL,
								width: "45%",
								editable: true
							}),
							new sap.m.Button({
								type: "Emphasized",
								text: "Reiniciar envío",
								width: "25%",
								icon: "sap-icon://refresh",
								visible: true,
								press: function () {
									this.getView().setBusy(true);
									var llave = {};
									llave.TOLERANCIA = "not";
									llave.ESTADOG = "O";
									//var url = "/odatabnv/odata2.svc/";
									var url = "" + this.varTableURL + "/";
									var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
									//oModel.update("/T_USERs('" + objeto.US_USUARIO + "')", llave, {
									oModel.update("/" + this.varTableT_USER + "('" + objeto.US_USUARIO + "')", llave, {
										method: "PUT",
										success: function (data) {
											this.getView().setBusy(false);
											var dialogA = new sap.m.Dialog({
												title: "Se reinició con éxito",
												type: "Message",
												state: "Success",
												content: new sap.m.Text({
													text: "El proveedor " + objeto.US_USUARIO + " puede nuevamente generar su contraseña."
												}),
												beginButton: new sap.m.Button({
													text: "OK",
													type: "Accept",
													press: function () {
														//this.llenarTablas("T_USER", "listUsuarios");
														this.llenarTablas("" + this.varTableT_USER + "", "listUsuarios");
														dialogA.close();
													}.bind(this)
												}),
												afterClose: function (response) {
													dialogA.destroy();
												}.bind(this)
											});
											dialogA.open();
										}.bind(this),
										error: function (data) {
											this.getView().setBusy(false);
											var dialogA = new sap.m.Dialog({
												title: "Se ha generado un error",
												type: "Message",
												state: "Error",
												content: new sap.m.Text({
													text: "No se reinició con exito."
												}),
												beginButton: new sap.m.Button({
													text: "OK",
													type: "Accept",
													press: function () {
														dialogA.close();
													}
												}),
												afterClose: function (response) {
													dialogA.destroy();
												}.bind(this)
											});
											dialogA.open();
										}.bind(this)
									});
								}.bind(this)
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Autorización : ",
								textAlign: "Right",
								width: "30%"
							}),
							checkBox01,
							checkBox02,
							checkBox0A
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Estado : ",
								textAlign: "Right",
								width: "30%"
							}),
							checkBox03,
							checkBox04
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Registro de Suministro y Servicios : ",
								textAlign: "Right",
								width: "30%"
							}),
							buttonSeccion1
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Registro de misceláneos : ",
								textAlign: "Right",
								width: "30%"
							}),
							buttonSeccion2
						]
					}),
					/*new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Registro de consignaciones : ",
								textAlign: "Right",
								width: "30%"
							}),
							buttonSeccion3
						]
					}),*/
					/*new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Devolución sin pedido : ",
								textAlign: "Right",
								width: "30%"
							}),
							buttonSeccion4
						]
					}),*/
					/*new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Registro de contratista : ",
								textAlign: "Right",
								width: "30%"
							}),
							buttonSeccion5
						]
					}),*/
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Registro Nota Cred. con pedido : ",
								textAlign: "Right",
								width: "30%"
							}),
							buttonSeccion6
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Reporte de factura : ",
								textAlign: "Right",
								width: "30%"
							}),
							buttonSeccion7
						]
					})
					/*new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Reporte de consignaciones : ",
								textAlign: "Right",
								width: "30%"
							}),
							buttonSeccion8
						]
					})*/
				],
				beginButton: new sap.m.Button({
					text: 'Guardar',
					icon: "sap-icon://save",
					press: function () {
						var dialogD = new sap.m.Dialog({
							title: "Mensaje de confirmación",
							type: "Message",
							state: "Information",
							content: new sap.m.Text({
								text: "Seguró que desea actualizar el usuario " + objeto.US_USUARIO + "."
							}),
							beginButton: new sap.m.Button({
								text: "Sí",
								type: "Accept",
								press: function () {
									this.getView().setBusy(true);
									var llave = {};
									var key01 = buttonSeccion1.getSelectedKey();
									if (key01 === "idMostrar") {
										llave.SEC_1 = "x";
									} else {
										llave.SEC_1 = "";
									}
									var key02 = buttonSeccion2.getSelectedKey();
									if (key02 === "idMostrar") {
										llave.SEC_2 = "x";
									} else {
										llave.SEC_2 = "";
									}
									var key03 = buttonSeccion3.getSelectedKey();
									if (key03 === "idMostrar") {
										llave.SEC_3 = "x";
									} else {
										llave.SEC_3 = "";
									}
									var key04 = buttonSeccion4.getSelectedKey();
									if (key04 === "idMostrar") {
										llave.SEC_4 = "x";
									} else {
										llave.SEC_4 = "";
									}
									var key05 = buttonSeccion5.getSelectedKey();
									if (key05 === "idMostrar") {
										llave.SEC_5 = "x";
									} else {
										llave.SEC_5 = "";
									}
									var key06 = buttonSeccion6.getSelectedKey();
									if (key06 === "idMostrar") {
										llave.SEC_6 = "x";
									} else {
										llave.SEC_6 = "";
									}
									var key07 = buttonSeccion7.getSelectedKey();
									if (key07 === "idMostrar") {
										llave.SEC_7 = "x";
									} else {
										llave.SEC_7 = "";
									}
									var key08 = buttonSeccion8.getSelectedKey();
									if (key08 === "idMostrar") {
										llave.SEC_8 = "x";
									} else {
										llave.SEC_8 = "";
									}
									var box01 = checkBox01.getSelected();
									var box02 = checkBox02.getSelected();
									if (box01) {
										llave.AUTORIZACION = "ADMIN";
									} else if (box02) {
										llave.AUTORIZACION = "ESTAN";
									} else {
										llave.AUTORIZACION = "AVANZ";
									}
									var box03 = checkBox03.getSelected();
									if (box03) {
										llave.ESTADO = "a";
									} else {
										llave.ESTADO = "d";
									}
									var varNombreDeUsuario = sap.ui.getCore().byId("idNombre").getValue();
									var varCorreoComparar1 = objeto.EMAIL;
									var varCorreoComparar2 = sap.ui.getCore().byId("idCorreo").getValue();
									if (varCorreoComparar1 !== varCorreoComparar2) {
										llave.TOLERANCIA = "not";
										llave.ESTADOG = "O";
										llave.EMAIL = varCorreoComparar2;
									}
									llave.NOM_USUARIO = varNombreDeUsuario;
									//var url = "/odatabnv/odata2.svc/";
									var url = "" + this.varTableURL + "/";
									var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
									//oModel.update("/T_USERs('" + objeto.US_USUARIO + "')", llave, {
									oModel.update("/" + this.varTableT_USER + "('" + objeto.US_USUARIO + "')", llave, {
										method: "PUT",
										success: function (data) {
											this.getView().setBusy(false);
											this.getDataUsuario();
											dialog2.close();
											dialogD.close();
											var dialogA = new sap.m.Dialog({
												title: "Se actualizó con éxito",
												type: "Message",
												state: "Success",
												content: new sap.m.Text({
													text: "Se actualizó correctamente el usuario " + objeto.US_USUARIO + "."
												}),
												beginButton: new sap.m.Button({
													text: "OK",
													type: "Accept",
													press: function () {
														//this.llenarTablas("T_USER", "listUsuarios");
														this.llenarTablas("" + this.varTableT_USER + "", "listUsuarios");
														dialogA.close();
													}.bind(this)
												}),
												afterClose: function (response) {
													dialogA.destroy();
												}.bind(this)
											});
											dialogA.open();
										}.bind(this),
										error: function (data) {
											this.getView().setBusy(false);
											var dialogA = new sap.m.Dialog({
												title: "Se ha generado un error",
												type: "Message",
												state: "Error",
												content: new sap.m.Text({
													text: "No se actualizó correctamente el usuario " + objeto.US_USUARIO + "."
												}),
												beginButton: new sap.m.Button({
													text: "OK",
													type: "Accept",
													press: function () {
														dialogA.close();
													}
												}),
												afterClose: function (response) {
													dialogA.destroy();
												}.bind(this)
											});
											dialogA.open();
											dialogD.close();
										}.bind(this)
									});
								}.bind(this)
							}),
							endButton: new sap.m.Button({
								text: "No",
								type: "Accept",
								press: function () {
									dialogD.close();
								}
							}),
							afterClose: function (response) {
								dialogD.destroy();
							}.bind(this)
						});
						dialogD.open();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		funcionAdministrador: function () {
			var filter;
			var filters1 = [];
			var filters2 = [];
			var filtersT = [];
			this.getView().byId("idChaeckEstandar").setSelected(false);
			this.getView().byId("idChaeckAvanzado").setSelected(false);
			this.getView().byId("idTxtRuc").setValue("");
			var varRuc = this.getView().byId("idTxtRuc").getValue();
			var varSelectCheck = this.getView().byId("idChaeckAdministrador").getSelected();
			if (varSelectCheck === true) {
				filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.Contains, varRuc);
				filters1.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters1, false));
				filter = new sap.ui.model.Filter("AUTORIZACION", sap.ui.model.FilterOperator.EQ, "ADMIN");
				filters2.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters2, false));
			} else {
				filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.Contains, varRuc);
				filters1.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters1, false));
			}
			var list = this.getView().byId("idTableUser");
			var binding = list.getBinding("rows");
			binding.filter(new sap.ui.model.Filter(filtersT, true));
		},
		funcionEstandar: function () {
			var filter;
			var filters1 = [];
			var filters2 = [];
			var filtersT = [];
			this.getView().byId("idChaeckAdministrador").setSelected(false);
			this.getView().byId("idChaeckAvanzado").setSelected(false);
			this.getView().byId("idTxtRuc").setValue("");
			var varRuc = this.getView().byId("idTxtRuc").getValue();
			var varSelectCheck = this.getView().byId("idChaeckEstandar").getSelected();
			if (varSelectCheck === true) {
				filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.Contains, varRuc);
				filters1.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters1, false));
				filter = new sap.ui.model.Filter("AUTORIZACION", sap.ui.model.FilterOperator.EQ, "ESTAN");
				filters2.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters2, false));
			} else {
				filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.Contains, varRuc);
				filters1.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters1, false));
			}
			var list = this.getView().byId("idTableUser");
			var binding = list.getBinding("rows");
			binding.filter(new sap.ui.model.Filter(filtersT, true));
		},
		funcionAvanzado: function () {
			var filter;
			var filters1 = [];
			var filters2 = [];
			var filtersT = [];
			this.getView().byId("idChaeckAdministrador").setSelected(false);
			this.getView().byId("idChaeckEstandar").setSelected(false);
			this.getView().byId("idTxtRuc").setValue("");
			var varRuc = this.getView().byId("idTxtRuc").getValue();
			var varSelectCheck = this.getView().byId("idChaeckAvanzado").getSelected();
			if (varSelectCheck === true) {
				filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.Contains, varRuc);
				filters1.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters1, false));
				filter = new sap.ui.model.Filter("AUTORIZACION", sap.ui.model.FilterOperator.EQ, "AVANZ");
				filters2.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters2, false));
			} else {
				filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.Contains, varRuc);
				filters1.push(filter);
				filtersT.push(new sap.ui.model.Filter(filters1, false));
			}
			var list = this.getView().byId("idTableUser");
			var binding = list.getBinding("rows");
			binding.filter(new sap.ui.model.Filter(filtersT, true));
		},
		btnBuscarRuc: function () {
			var filter;
			var filters1 = [];
			var filtersT = [];
			this.getView().byId("idChaeckEstandar").setSelected(false);
			this.getView().byId("idChaeckAdministrador").setSelected(false);
			var varRuc = this.getView().byId("idTxtRuc").getValue();
			filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.Contains, varRuc);
			filters1.push(filter);
			filtersT.push(new sap.ui.model.Filter(filters1, false));
			var list = this.getView().byId("idTableUser");
			var binding = list.getBinding("rows");
			binding.filter(new sap.ui.model.Filter(filtersT, true));
		},
		onPressCrearEmpresa: function (evt) {
			var dialog2 = new sap.m.Dialog({
				title: 'Crear Empresa',
				icon: "sap-icon://factory",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "600px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "RUC Empresa : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idRuc",
								placeholder: "Ingrese RUC proveedor (11) ...",
								maxLength: 11,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Descripción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idDes",
								placeholder: "Ingrese descripción (100) ...",
								maxLength: 100,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Sociedad : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idSoc",
								placeholder: "Ingrese Sociedad (4) ...",
								maxLength: 100,
								width: "70%",
								editable: true
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Guardar',
					icon: "sap-icon://save",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idRuc"),
							sap.ui.getCore().byId("idDes"),
							sap.ui.getCore().byId("idSoc")
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
							this.getView().setBusy(true);
							var llave = {};
							llave.RUC_EM = sap.ui.getCore().byId("idRuc").getValue();
							llave.DES_EM = sap.ui.getCore().byId("idDes").getValue();
							llave.SOC_EM = sap.ui.getCore().byId("idSoc").getValue();
							var descripcion = sap.ui.getCore().byId("idDes").getValue();
							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							//oModel.create("/T_CENs", llave, {
							oModel.create("/" + this.varTableT_CEN + "", llave, {
								method: "POST",
								success: function (data) {
									this.getView().setBusy(false);
									dialog2.close();
									var dialogA = new sap.m.Dialog({
										title: "Se registró con éxito",
										type: "Message",
										state: "Success",
										content: new sap.m.Text({
											text: "Se ingresó correctamente el proveedor " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												//this.llenarTablas("T_CEN", "listEmpresa");
												this.llenarTablas("" + this.varTableT_CEN + "", "listEmpresa");
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
								}.bind(this),
								error: function (data) {
									this.getView().setBusy(false);
									var dialogA = new sap.m.Dialog({
										title: "Se ha generado un error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "No se registró el proveedor " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												dialogA.close();
											}
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
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
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		editarEmpresa: function (evt) {
			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			var varRucReg = objeto.RUC_EM;
			var varDesReg = objeto.DES_EM;
			var varSocReg = objeto.SOC_EM;
			var dialog2 = new sap.m.Dialog({
				title: 'Editar Empresa',
				icon: "sap-icon://factory",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "600px",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "RUC Empresa : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idRuc",
								placeholder: "Ingrese RUC proveedor (11) ...",
								value: varRucReg,
								maxLength: 11,
								width: "70%",
								editable: false
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Descripción : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idDes",
								placeholder: "Ingrese descripción (100) ...",
								value: varDesReg,
								maxLength: 100,
								width: "70%",
								editable: true
							})
						]
					}),
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
								text: "Sociedad : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idSoc",
								placeholder: "Ingrese Sociedad (4) ...",
								value: varSocReg,
								maxLength: 100,
								width: "70%",
								editable: true
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Actualizar',
					icon: "sap-icon://edit",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idRuc"),
							sap.ui.getCore().byId("idDes"),
							sap.ui.getCore().byId("idSoc")
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
							this.getView().setBusy(true);
							var llave = {};
							llave.RUC_EM = sap.ui.getCore().byId("idRuc").getValue();
							llave.DES_EM = sap.ui.getCore().byId("idDes").getValue();
							llave.SOC_EM = sap.ui.getCore().byId("idSoc").getValue();
							var descripcion = sap.ui.getCore().byId("idDes").getValue();
							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							//oModel.update("/T_CENs(RUC_EM='" + varRucReg + "')", llave, {
							oModel.update("/" + this.varTableT_CEN + "(RUC_EM='" + varRucReg + "')", llave, {
								method: "POST",
								success: function (data) {
									this.getView().setBusy(false);
									dialog2.close();
									var dialogA = new sap.m.Dialog({
										title: "Se editó con éxito",
										type: "Message",
										state: "Success",
										content: new sap.m.Text({
											text: "Se editó correctamente el proveedor " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												//this.llenarTablas("T_CEN", "listEmpresa");
												this.llenarTablas("" + this.varTableT_CEN + "", "listEmpresa");
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
								}.bind(this),
								error: function (data) {
									this.getView().setBusy(false);
									var dialogA = new sap.m.Dialog({
										title: "Se ha generado un error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "No se editó el proveedor " + descripcion + "."
										}),
										beginButton: new sap.m.Button({
											text: "OK",
											type: "Accept",
											press: function () {
												dialogA.close();
											}
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
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
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		eliminarEmpresa: function (evt) {
			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var objeto = oContext.getObject();
			var varRucReg = objeto.RUC_EM;
			var varDesReg = objeto.DES_EM;
			var dialog2 = new sap.m.Dialog({
				title: 'Eliminar Empresa',
				icon: "sap-icon://factory",
				type: 'Message',
				draggable: true,
				resizable: true,
				contentWidth: "auto",
				content: [
					new sap.m.Toolbar({
						height: "auto",
						width: "100%",
						content: [new sap.m.Label({
							text: "Desea eliminar la empresa " + varRucReg + " - " + varDesReg,
							textAlign: "Center",
							width: "100%"
						})]
					})
				],
				beginButton: new sap.m.Button({
					text: 'Eliminar',
					icon: "sap-icon://delete",
					press: function () {
						this.getView().setBusy(true);
						//var url = "/odatabnv/odata2.svc/";
						var url = "" + this.varTableURL + "/";
						var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
						//oModel.remove("/T_CENs(RUC_EM='" + varRucReg + "')", {
						oModel.remove("/" + this.varTableT_CEN + "(RUC_EM='" + varRucReg + "')", {
							method: "POST",
							success: function (data) {
								this.getView().setBusy(false);
								dialog2.close();
								var dialogA = new sap.m.Dialog({
									title: "Se eliminó con éxito",
									type: "Message",
									state: "Success",
									content: new sap.m.Text({
										text: "Se eliminó correctamente el proveedor " + varRucReg + " - " + varDesReg + "."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Accept",
										press: function () {
											//this.llenarTablas("T_CEN", "listEmpresa");
											this.llenarTablas("" + this.varTableT_CEN + "", "listEmpresa");
											dialogA.close();
										}.bind(this)
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)
								});
								dialogA.open();
							}.bind(this),
							error: function (data) {
								this.getView().setBusy(false);
								var dialogA = new sap.m.Dialog({
									title: "Se ha generado un error",
									type: "Message",
									state: "Error",
									content: new sap.m.Text({
										text: "No se eliminó el proveedor " + varRucReg + " - " + varDesReg + "."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Accept",
										press: function () {
											dialogA.close();
										}
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)
								});
								dialogA.open();
							}.bind(this)
						});
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					icon: "sap-icon://sys-cancel",
					press: function () {
						dialog2.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		handleLiveChange: function (tabla, oEvent) {
			var newValue = oEvent.getParameter("value");
			var filter;
			var filters1 = [];
			var filtersT = [];
			filter = new sap.ui.model.Filter("RUC_EM", sap.ui.model.FilterOperator.Contains, newValue);
			filters1.push(filter);
			filtersT.push(new sap.ui.model.Filter(filters1, false));
			var list = this.getView().byId(tabla);
			var binding = list.getBinding("rows");
			binding.filter(new sap.ui.model.Filter(filtersT, true));
		},

		//Begin I@MM-21/12/2021-Ticket-2021-999
		/*handleLiveChange4: function (tabla, oEvent) {
			var newValue = oEvent.getParameter("value");
			var filter;
			var filters1 = [];
			var filtersT = [];
			filter = new sap.ui.model.Filter("DE_NUM_MATERIAL", sap.ui.model.FilterOperator.Contains, newValue);
			filters1.push(filter);
			filtersT.push(new sap.ui.model.Filter(filters1, false));
			var list = this.getView().byId(tabla);
			var binding = list.getBinding("rows");
			binding.filter(new sap.ui.model.Filter(filtersT, true));
		},*/
		//End I@MM-21/12/2021-Ticket-2021-999

		getDataUsuario: function () {
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			oModelJson.read("/" + this.varTableT_USER + "?$format=json", {
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var tamTabla = oModelJSON.getData().length;
					var vector = [];
					var llave = {};
					for (var i = 0; i < tamTabla; i++) {
						llave = {};
						llave.descripcion = oModelJSON.getData()[i].NOM_USUARIO;
						llave.codigo = oModelJSON.getData()[i].US_USUARIO;
						llave.tipo = oModelJSON.getData()[i].AUTORIZACION;
						vector.push(llave);
					}
					var model = this.getView().getModel();
					model.setSizeLimit(500);
					oModel.setProperty("/listaProveedoresRUC", vector);
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listaProveedoresRUC", []);
				}.bind(this)
			});
		},
		btnEliminarDoc: function () {
			var dialogB = new sap.m.Dialog({
				title: "Mensaje de Confirmación",
				type: "Message",
				state: "Success",
				content: new sap.m.Text({
					text: "¿Desea eliminar el documento del Document Service si es que existe?"
				}),
				beginButton: new sap.m.Button({
					text: "OK",
					type: "Emphasized",
					icon: "sap-icon://delete",
					press: function () {
						this.getView().setBusy(true);
						var data1 = {
							'cmisaction': 'delete'
						};
						var formData = new FormData();
						jQuery.each(data1, function (key, value) {
							formData.append(key, value);
						});
						var varNombreDocumento = this.getView().byId("idRDocumento").getValue();
						$.ajax("" + this.varTableDocument + "/" + varNombreDocumento, {
							type: 'POST',
							data: formData,
							cache: false,
							processData: false,
							contentType: false,
							success: function (response) {
								this.getView().setBusy(false);
								var dialogA = new sap.m.Dialog({
									title: "Mensaje",
									type: "Message",
									state: "Success",
									content: new sap.m.Text({
										text: "Se eliminó correctamente el documento."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Emphasized",
										press: function () {
											dialogA.close();
										}.bind(this)
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)
								});
								dialogA.open();
							}.bind(this),
							error: function (response) {
								this.getView().setBusy(false);
								var dialogA = new sap.m.Dialog({
									title: "Mensaje",
									type: "Message",
									state: "Error",
									content: new sap.m.Text({
										text: "No se encontró el documento."
									}),
									beginButton: new sap.m.Button({
										text: "OK",
										type: "Emphasized",
										press: function () {
											dialogA.close();
										}
									}),
									afterClose: function (response) {
										dialogA.destroy();
									}.bind(this)
								});
								dialogA.open();
							}.bind(this)
						});
						dialogB.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					icon: "sap-icon://cancel",
					text: "Cancelar",
					type: "Emphasized",
					press: function () {
						dialogB.close();
					}
				}),
				afterClose: function (response) {
					dialogB.destroy();
				}.bind(this)
			});
			dialogB.open();
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
		formatoEstadoTextBoton: function (est) {
			if (est !== "" && est !== null && est !== undefined) {
				if (est === "Validacion_CPE_SUNAT") {
					return "Habilitar / Inhabilitar";
				} else if (est === "Validacion_dias_habiles") {
					return "Habilitar / Inhabilitar";
				} else if (est === "Validacion_dias_calendario") { //I@MM-16/12/2021-Ticket-2021-999
					return "Habilitar / Inhabilitar";
				} else if (est === "Validacion_porcentaje_tolerancia") {
					return "Editar";
				} else if (est === "Descarga_total_de_facturas") {
					return "Descarga";
				} else if (est === "Validacion_reporte01" || est === "Validacion_reporte02") {
					return "Editar";
				}
			}
		},
		formatoEstadoIconBoton: function (est) {
			if (est !== "" && est !== null && est !== undefined) {
				if (est === "Validacion_CPE_SUNAT") {
					return "sap-icon://edit";
				} else if (est === "Validacion_dias_habiles") {
					return "sap-icon://edit";
				} else if (est === "Validacion_dias_calendario") { //I@MM-16/12/2021-Ticket-2021-999
					return "sap-icon://edit";
				} else if (est === "Validacion_porcentaje_tolerancia") {
					return "sap-icon://edit";
				} else if (est === "Descarga_total_de_facturas") {
					return "sap-icon://excel-attachment";
				}
			}
		},
		btnDescargarFacturasTotal: function () {
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			oModelJson.read("/" + this.varTableT_FAC + "?$format=json", {
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var tamTabla = oModelJSON.getData().length;
					var vector = [];
					var llave = {};
					for (var i = 0; i < tamTabla; i++) {
						llave = {};
						llave.EM_RUC11 = oModelJSON.getData()[i].EM_RUC;
						llave.US_RUC11 = oModelJSON.getData()[i].US_RUC;
						llave.ID_FACTURA11 = oModelJSON.getData()[i].ID_FACTURA;
						llave.CODIGO_CONCENTRACION11 = oModelJSON.getData()[i].CODIGO_CONCENTRACION;
						llave.DIRECCION11 = oModelJSON.getData()[i].DIRECCION;
						llave.ESTADO11 = this.formatoEstado(oModelJSON.getData()[i].ESTADO);
						llave.FC_FEC_EMISION11 = oModelJSON.getData()[i].FC_FEC_EMISION;
						llave.FC_FEC_REGISTRO11 = oModelJSON.getData()[i].FC_FEC_REGISTRO;
						llave.FC_HORA_REGISTRO11 = oModelJSON.getData()[i].FC_HORA_REGISTRO;
						llave.FC_USER_REGISTRO11 = oModelJSON.getData()[i].FC_USER_REGISTRO;
						llave.FEC_JOB11 = oModelJSON.getData()[i].FEC_JOB;
						llave.GLOSA11 = oModelJSON.getData()[i].GLOSA;
						llave.MONEDA11 = oModelJSON.getData()[i].MONEDA;
						llave.NOM_COMERCIAL11 = oModelJSON.getData()[i].NOM_COMERCIAL;
						llave.NOM_DEM_RAZ11 = oModelJSON.getData()[i].NOM_DEM_RAZ;
						llave.NOM_DEM_RAZ_ADQ11 = oModelJSON.getData()[i].NOM_DEM_RAZ_ADQ;
						llave.RUC_ADQ11 = oModelJSON.getData()[i].RUC_ADQ;
						llave.TASA_IGV11 = oModelJSON.getData()[i].TASA_IGV;
						llave.TIPO_CARGA11 = this.formatoTipoCarga(oModelJSON.getData()[i].TIPO_CARGA);
						llave.TIPO_DOC11 = oModelJSON.getData()[i].TIPO_DOC;
						llave.TIPO_OPERACION11 = oModelJSON.getData()[i].TIPO_OPERACION;
						llave.TOTAL_DESC11 = oModelJSON.getData()[i].TOTAL_DESC;
						llave.TOTAL_IGV11 = oModelJSON.getData()[i].TOTAL_IGV;
						llave.TOTAL_IMP11 = oModelJSON.getData()[i].TOTAL_IMP;
						llave.UBL11 = oModelJSON.getData()[i].UBL;
						llave.BANCO11 = oModelJSON.getData()[i].BANCO;
						llave.CONDICION_PAGO11 = oModelJSON.getData()[i].CONDICION_PAGO;
						llave.FEC_PAGO11 = oModelJSON.getData()[i].FEC_PAGO;
						llave.FEC_TEN11 = oModelJSON.getData()[i].FEC_TEN;
						llave.TEXTO_CAB_DOCUMENTO11 = oModelJSON.getData()[i].TEXTO_CAB_DOCUMENTO;
						llave.FEC_BASE11 = oModelJSON.getData()[i].FEC_BASE;
						llave.FEC_CONTABILIZACION11 = oModelJSON.getData()[i].FEC_CONTABILIZACION;
						llave.FEC_VENCIMIENTO11 = oModelJSON.getData()[i].FEC_VENCIMIENTO;
						vector.push(llave);
					}
					var oView = this.getView();
					var oModel = oView.getModel("myParam");
					oModel.setProperty("/tbListT_FAC_Excel", vector);
					this.onExport();
				}.bind(this),
				error: function (oError) {}.bind(this)
			});
		},
		onExport: function () {
			var aCols, aProducts, oSettings, oSheet;
			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel("myParam").getProperty('/tbListT_FAC_Excel');
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
				label: 'EM_RUC',
				property: 'EM_RUC11',
				type: 'string'
			});
			aCols.push({
				label: 'US_RUC',
				property: 'US_RUC11',
				type: 'string'
			});
			aCols.push({
				label: 'ID_FACTURA',
				property: 'ID_FACTURA11',
				type: 'string'
			});
			aCols.push({
				label: 'ESTADO',
				property: 'ESTADO11',
				type: 'string'
			});
			aCols.push({
				label: 'FC_FEC_EMISION',
				property: 'FC_FEC_EMISION11',
				type: 'string'
			});
			aCols.push({
				label: 'FC_FEC_REGISTRO',
				property: 'FC_FEC_REGISTRO11',
				type: 'string'
			});
			aCols.push({
				label: 'FC_HORA_REGISTRO',
				property: 'FC_HORA_REGISTRO11',
				type: 'string'
			});
			aCols.push({
				label: 'MONEDA',
				property: 'MONEDA11',
				type: 'string'
			});
			aCols.push({
				label: 'NOM_COMERCIAL',
				property: 'NOM_COMERCIAL11',
				type: 'string'
			});
			aCols.push({
				label: 'TASA_IGV',
				property: 'TASA_IGV11',
				type: 'string'
			});
			aCols.push({
				label: 'TIPO_CARGA',
				property: 'TIPO_CARGA11',
				type: 'string'
			});
			aCols.push({
				label: 'TIPO_DOC',
				property: 'TIPO_DOC11',
				type: 'string'
			});
			aCols.push({
				label: 'TOTAL_IGV',
				property: 'TOTAL_IGV11',
				type: 'string'
			});
			aCols.push({
				label: 'TOTAL_IMP',
				property: 'TOTAL_IMP11',
				type: 'string'
			});
			return aCols;
		}
	});
});