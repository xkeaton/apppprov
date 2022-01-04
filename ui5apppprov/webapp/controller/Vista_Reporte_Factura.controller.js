sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/unified/FileUploader",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter"
], function (Controller, JSONModel, FileUploader, MessageToast, UploadCollectionParameter) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Reporte_Factura", {

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

		varContTabla1: 0,
		varContTabla2: 0,
		varContTabla3: 0,
		varContTabla4: 0,
		varContTabla5: 0,
		varEstado1: "V",
		varEstado2: "V",
		varEstado3: "V",
		varEstado4: "V",
		varObjeto1: "",

		onInit: function () {
			this.getRouter().getRoute("Vista_Reporte_Factura").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("idTableItemFacturas").setSelectionMode("Single");
			this.getView().byId("idTableItemFacturas").setSelectionBehavior("RowOnly");
			this.getView().byId("idEliminar").addStyleClass("miIconoBlanco");
			this.getView().byId("idLogOff").addStyleClass("miIconoBlanco");
			this.getView().byId("idNavMenu").addStyleClass("miIconoBlanco");
			this.getView().byId("idFilter").addStyleClass("miIconoBlanco");
		},
		pressDocumento: function (evt) {
			var objeto = evt.getSource().getBindingContext("myParam").getObject();
			var filename = objeto.NOMBRE_DOC;
			//var uri = "/DOCUMENT/6d47b482a30ca504bfdf66d5/root/" + filename;
			var uri = "" + this.varTableDocument + "/" + filename;
			console.log(objeto);
			console.log(uri);
			$.ajax("" + this.varTableDocumentConsultar + "" + filename, {
				method: 'GET',
				success: function (response) {
					console.log(response);
					response = response.toString();
					response = response.split("<t1>");
					response = response[1];
					response = response.split("</t1>");
					response = response[0];
					var vectorReg = response.split("|");	
					console.log(vectorReg);
					if(vectorReg.length>1){
						var link = document.createElement("a");
						link.download = filename;
						link.href = uri;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					}else{
						sap.m.MessageToast.show("No existe el documento " + filename + ".");
					}
				}.bind(this),
				error: function (err) {
					console.log(err);
					sap.m.MessageToast.show("No se pudo eliminar el documento " + filename + ".");
			
				}.bind(this)
			});	

		},
		handleDelete: function (evt) {
			this.getView().byId("detailF").setBusy(true);
			var objeto = evt.getParameter("listItem").getBindingContext("myParam").getObject();
			var ID_FACTURA = objeto.ID_FACTURA;
			var oModelmyParam = this.getView().getModel("myParam");
			var data1 = {
				'cmisaction': 'delete'
			};
			var formData = new FormData();
			jQuery.each(data1, function (key, value) {
				formData.append(key, value);
			});
			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelOdata = new sap.ui.model.odata.v2.ODataModel(url, true);
			//$.ajax("/DOCUMENT/6d47b482a30ca504bfdf66d5/root/" + objeto.NOMBRE_DOC, {
			$.ajax("" + this.varTableDocument + "/" + objeto.NOMBRE_DOC, {
				type: 'POST',
				data: formData,
				cache: false,
				processData: false,
				contentType: false,
				success: function (response) {

					//oModelOdata.remove("/T_DOCs(EM_RUC='" + objeto.EM_RUC + "',US_RUC='" + objeto.US_RUC +
					oModelOdata.remove("/" + this.varTableT_DOC + "(EM_RUC='" + objeto.EM_RUC + "',US_RUC='" + objeto.US_RUC +
						"',ID_FACTURA='" + objeto.ID_FACTURA +
						"',POS_DOCUMENTO='" + objeto.POS_DOCUMENTO +
						"')", {
							success: function (data) {
								var filters = [];
								var filter;
								filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, ID_FACTURA);
								filters.push(filter);
								//oModelOdata.read("/T_DOCs?$format=json", {
								oModelOdata.read("/" + this.varTableT_DOC + "?$format=json", {
									filters: filters,
									success: function (response) {

										var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
										var lenghtV = oModelJSON.getData().length;
										if (lenghtV === 0) {
											this.getView().byId("idLayoutDoc").setVisible(false);
											this.getView().byId("idToolbarNotFound").setVisible(true);
										} else {
											this.getView().byId("idLayoutDoc").setVisible(true);
											this.getView().byId("idToolbarNotFound").setVisible(false);
										}
										oModelmyParam.setProperty("/listDocAdjuntarFac", oModelJSON.getData());
										oModelmyParam.setProperty("/listDocAdjuntarFacLenght", lenghtV);
										this.getView().byId("detailF").setBusy(false);
										this.getView().byId("idListDocumentos").getBinding("items").refresh(true);
									}.bind(this),
									error: function (oError) {
										oModelmyParam.setProperty("/listDocAdjuntarFac", []);
										oModelmyParam.setProperty("/listDocAdjuntarFacLenght", 0);
										this.getView().byId("detailF").setBusy(false);
										this.getView().byId("idListDocumentos").getBinding("items").refresh(true);
										this.getView().byId("idLayoutDoc").setVisible(false);
										this.getView().byId("idToolbarNotFound").setVisible(true);
										// Mensaje de Alerta de que termino el tiempo de sesión
										var dialogMensajeSesion = new sap.m.Dialog({
											draggable: true,
											resizable: true,
											contentWidth: "auto",
											title: "Mensaje de alerta",
											content: [
												new sap.m.Label({
													text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
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
								var dialog2 = new sap.m.Dialog({
									title: 'Éxito',
									type: 'Message',
									state: 'Success',
									icon: "sap-icon://attachment",
									content: new sap.m.Text({
										text: "Se eliminó con éxito el documento '" + objeto.NOMBRE_DOC + "' ."
									}),
									beginButton: new sap.m.Button({
										text: 'Aceptar',
										icon: "sap-icon://accept",
										type: "Accept",
										press: function () {
											dialog2.close();
										}.bind(this)
									}),
									afterClose: function () {
										dialog2.destroy();
									}
								});

								dialog2.open();
								this.getView().byId("detailF").setBusy(false);
							}.bind(this),
							error: function (data) {
								var dialog2 = new sap.m.Dialog({
									title: 'Error',
									type: 'Message',
									state: 'Error',
									icon: "sap-icon://attachment",
									content: new sap.m.Text({
										text: "No se eliminó el documento '" + objeto.NOMBRE_DOC + "' correctamente ."
									}),
									beginButton: new sap.m.Button({
										text: 'Aceptar',
										icon: "sap-icon://accept",
										type: "Accept",
										press: function () {
											dialog2.close();
										}.bind(this)
									}),
									afterClose: function () {
										dialog2.destroy();
									}
								});

								dialog2.open();
								this.getView().byId("detailF").setBusy(false);
							}.bind(this)
						});

				}.bind(this),
				error: function (error) {
					var dialog2 = new sap.m.Dialog({
						title: 'Error',
						type: 'Message',
						state: 'Error',
						icon: "sap-icon://attachment",
						content: new sap.m.Text({
							text: "No se eliminó el documento '" + objeto.NOMBRE_DOC + "' correctamente ."
						}),
						beginButton: new sap.m.Button({
							text: 'Aceptar',
							icon: "sap-icon://accept",
							type: "Accept",
							press: function () {
								dialog2.close();
							}.bind(this)
						}),
						afterClose: function () {
							dialog2.destroy();
						}
					});
					dialog2.open();
					this.getView().byId("detailF").setBusy(false);
				}.bind(this)
			});

		},
		handleTitlePress: function (evt) {
			var factura = this.getView().byId("ohFac").getBindingContext("myParam").getObject().ID_FACTURA;

			var filename = factura + ".xml";
			//var uri = "/DOCUMENT/6d47b482a30ca504bfdf66d5/root/" + filename;
			var uri = "" + this.varTableDocument + "/" + filename;
			var link = document.createElement("a");
			link.download = filename;
			link.href = uri;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		onChangeFile: function (evt) {
			this.getView().byId("detailF").setBusy(true);
			var oFileUploader = evt.getSource();
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			var fileName = file.name;

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

			//$.ajax('/DOCUMENT/6d47b482a30ca504bfdf66d5/root', {
			$.ajax("" + this.varTableDocument + "", {
				method: 'POST',
				data: formData,
				cache: false,
				processData: false,
				contentType: false,
				success: function (response) {
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

					//var url = "/odatabnv/odata2.svc/";
					var url = "" + this.varTableURL + "/";
					var oModelOdata = new sap.ui.model.odata.v2.ODataModel(url, true);
					var oModelmyParam = this.getView().getModel("myParam");
					var usuarioLogin = oModelmyParam.getProperty("/usuarioLogin");
					var docLength = oModelmyParam.getProperty("/listDocAdjuntarFac/length");
					docLength++;
					var objeto = this.getView().byId("ohFac").getBindingContext("myParam").getObject();
					var llaveDocumento = {};
					llaveDocumento.EM_RUC = objeto.EM_RUC;
					llaveDocumento.US_RUC = objeto.US_RUC;
					llaveDocumento.ID_FACTURA = objeto.ID_FACTURA;
					llaveDocumento.POS_DOCUMENTO = docLength.toString();
					llaveDocumento.NOMBRE_DOC = fileName;
					fileName = fileName.split(".");
					if (fileName.length === 1) {
						llaveDocumento.FORMATO = null;
					} else {
						llaveDocumento.FORMATO = fileName[1];
					}
					llaveDocumento.TAMANO = calculo;
					llaveDocumento.FECHA_DOC = date;
					llaveDocumento.HORA_DOC = time;
					llaveDocumento.FECHA_ADJ = dateUsu;
					llaveDocumento.HORA_ADJ = timeUsu;
					llaveDocumento.USUARIO = usuarioLogin;

					//oModelOdata.create("/T_DOCs", llaveDocumento, {
					oModelOdata.create("/" + this.varTableT_DOC + "", llaveDocumento, {
						method: "POST",
						success: function (data) {

							var filters = [];
							var filter;
							filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, data.ID_FACTURA);
							filters.push(filter);
							//oModelOdata.read("/T_DOCs?$format=json", {
							oModelOdata.read("/" + this.varTableT_DOC + "?$format=json", {
								filters: filters,
								success: function (response) {

									var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
									var lenghtV = oModelJSON.getData().length;
									if (lenghtV === 0) {
										this.getView().byId("idLayoutDoc").setVisible(false);
										this.getView().byId("idToolbarNotFound").setVisible(true);
									} else {
										this.getView().byId("idLayoutDoc").setVisible(true);
										this.getView().byId("idToolbarNotFound").setVisible(false);
									}
									oModelmyParam.setProperty("/listDocAdjuntarFac", oModelJSON.getData());
									oModelmyParam.setProperty("/listDocAdjuntarFacLenght", lenghtV);
									this.getView().byId("detailF").setBusy(false);
									this.getView().byId("idListDocumentos").getBinding("items").refresh(true);
								}.bind(this),
								error: function (oError) {
									oModelmyParam.setProperty("/listDocAdjuntarFac", []);
									oModelmyParam.setProperty("/listDocAdjuntarFacLenght", 0);
									this.getView().byId("detailF").setBusy(false);
									this.getView().byId("idListDocumentos").getBinding("items").refresh(true);
									this.getView().byId("idLayoutDoc").setVisible(false);
									this.getView().byId("idToolbarNotFound").setVisible(true);
									// Mensaje de Alerta de que termino el tiempo de sesión
									var dialogMensajeSesion = new sap.m.Dialog({
										draggable: true,
										resizable: true,
										contentWidth: "auto",
										title: "Mensaje de alerta",
										content: [
											new sap.m.Label({
												text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
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

							var dialog = new sap.m.Dialog({
								title: "Éxito",
								type: "Message",
								state: "Success",
								icon: "sap-icon://expense-report",
								content: new sap.m.Text({
									text: "Se registró el documento '" + fileName + "' correctamente."

								}),
								beginButton: new sap.m.Button({
									text: "Aceptar",
									press: function () {
										dialog.close();
									}.bind(this)
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});
							dialog.open();
						}.bind(this),
						error: function (data) {
							this.obtenerErrorOdata2(data, "Error al registrar en el Document Service", "No se pudo adjuntar el documento " + fileName +
								".");
							this.getView().byId("detailF").setBusy(false);
						}.bind(this)
					});

				}.bind(this),
				error: function (error) {
					var clistErroresSubTitulo;
					var clistErroresTitulo;
					try {
						clistErroresTitulo = error.responseJSON.exception;
						clistErroresSubTitulo = error.responseJSON.message;
					} catch (err) {
						clistErroresTitulo = "Error al registrar en el Document Service";
						clistErroresSubTitulo = "No se pudo adjuntar el documento " + fileName + ".";
					}
					var dialog = new sap.m.Dialog({
						title: clistErroresTitulo,
						type: "Message",
						state: "Error",
						icon: "sap-icon://add-document",
						content: new sap.m.Text({
							text: clistErroresSubTitulo.toString()
						}),
						beginButton: new sap.m.Button({
							text: "Aceptar",
							press: function () {
								dialog.close();
							}.bind(this)
						}),
						afterClose: function () {
							dialog.destroy();
						}
					});
					dialog.open();

					this.getView().byId("detailF").setBusy(false);
				}.bind(this)
			});
		},
		obtenerErrorOdata2: function (response, titulo2, mensaje2) {
			var clistErroresSubTitulo = "";
			var clistErroresTitulo = "";
			try {
				var responseText = response.responseText;
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(responseText, "text/xml");
				var message = xmlDoc.getElementsByTagName("error")[0].textContent;
				clistErroresTitulo = "(" + response.statusCode + ") " + response.statusText;
				clistErroresSubTitulo = message;
			} catch (err) {
				clistErroresTitulo = titulo2;
				clistErroresSubTitulo = mensaje2;
			}
			var dialog = new sap.m.Dialog({
				title: clistErroresTitulo,
				type: "Message",
				state: "Error",
				icon: "sap-icon://add-document",
				content: new sap.m.Text({
					text: clistErroresSubTitulo.toString()
				}),
				beginButton: new sap.m.Button({
					text: "Aceptar",
					press: function () {
						dialog.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();

		},
		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onSearchFac: function (oEvt) {

			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// Actualiza la lista
			var list = this.byId("idListMaster1");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		onSearchObjeto: function (oEvt) {

			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("NOMBRE_DOC", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// Actualiza la lista
			var list = this.byId("idListDocumentos");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		_onRouteMatched: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
			oProductDetail1PanelCabecera.setVisible(false);
			this.getView().byId("idEliminar").setVisible(false);
			var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
			oProductDetail1PanelIconBar.setVisible(false);
			this.getView().byId("idErrores").setVisible(false);
			this.inicioListaFacturas();

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

			this.varContTabla1 = 0;
			this.varContTabla2 = 0;
			this.varContTabla3 = 0;
			this.varContTabla4 = 0;
			this.varContTabla5 = 0;
			this.varEstado1 = "V";
			this.varEstado2 = "V";
			this.varEstado3 = "V";
			this.varEstado4 = "V";
			this.varObjeto1 = "";
		},
		btnBuscarItem: function (oEvent) {
			// Llamar modelo
			var myParam = this.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var factura = oContext.getObject();
			this.factura1 = oContext.getObject();

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
				width: "60rem",
				rows: "{/facturaSeleccionada}"
			});
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Posición"
				}),
				template: new sap.m.Text({
					text: "{POS}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Código"
				}),
				template: new sap.m.Text({
					text: "{COD}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe sin IGV"
				}),
				template: new sap.m.Text({
					text: "{TOTALSINUGV}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe con IGV"
				}),
				template: new sap.m.Text({
					text: "{NETO}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "20rem",
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
					text: "Fecha Ingreso"
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
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Documento/H.E.S."
				}),
				template: new sap.m.Text({
					text: "{VALE}"
				})
			}));

			oTableItem.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Guía remisión"
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
				width: "9rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe sin IGV"
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
			var oDialogSelectItems = new sap.m.Dialog("idDialogSelectItems", {

				title: "Detalle de asignación",
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
								text: "Tabla de asignación por documento de ingreso"
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

					//var url = "/odatabnv/odata2.svc/";
					var url = "" + this.varTableURL + "/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
					var filters = [];
					var filter;
					filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, factura.ID_FACTURA);
					filters.push(filter);
					filter = new sap.ui.model.Filter("POS_FACTURA", sap.ui.model.FilterOperator.EQ, factura.POS_FACTURA);
					filters.push(filter);
					//oModel.read("/T_FAC_POSs?$format=json", {
					oModel.read("/" + this.varTableT_FAC_POS + "?$format=json", {
						filters: filters,
						success: function (response) {

							var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
							var lenghtV = oModelJSON.getData().length;
							myParam.setProperty("/clistItemsOrdenCompra", oModelJSON.getData());
							var total = 0;
							for (var i = 0; i < lenghtV; i++) {
								total += parseFloat(oModelJSON.getData()[i].PRECIO_ING.toString().replace(',', ''), 10);
							}
							total = total.toFixed(2);
							var subTotal = [];
							var llaveSub = {};
							llaveSub.total = total;
							subTotal.push(llaveSub);
							myParam.setProperty("/subTotal", subTotal);
							oTableItem.getBinding("rows").refresh(true);
							oTableSubTotal.getBinding("rows").refresh(true);

							///////////////////
							// Obtener los datos del Item selecconados
							var NewTableCab = [];
							var NewContTableCab = {};
							NewContTableCab.POS = this.factura1.POS_FACTURA;
							NewContTableCab.COD = this.factura1.CODIGO;
							NewContTableCab.MATERIAL = this.factura1.DESCRIPCION;
							NewContTableCab.NETO = this.factura1.PRECIO_NETO;
							NewContTableCab.TOTALSINUGV = total;
							NewTableCab.push(NewContTableCab);
							myParam.setProperty("/facturaSeleccionada", NewTableCab);
						}.bind(this),
						error: function (oError) {
							myParam.setProperty("/clistItemsOrdenCompra", []);
							myParam.setProperty("/subTotal", []);
							oTableItem.getBinding("rows").refresh(true);
							oTableSubTotal.getBinding("rows").refresh(true);
							// Mensaje de Alerta de que termino el tiempo de sesión
							var dialogMensajeSesion = new sap.m.Dialog({
								draggable: true,
								resizable: true,
								contentWidth: "auto",
								title: "Mensaje de alerta",
								content: [
									new sap.m.Label({
										text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
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

				}.bind(this)
			});

			oDialogSelectItems.open();
		},

		btnBuscarItem2: function (oEvent) {
			// Llamar modelo
			var myParam = this.getView().getModel("myParam");
			var factura = myParam.getProperty("/listItemFacturas/0");
			
			var varUsuario = myParam.getProperty("/usuarioLogin");
			var varRUC = myParam.getProperty("/usuarioRuc");

			// Obtener los datos del Item selecconados

			// Obtener el ID principal de lo seleccionado

			/*var oTable = new sap.ui.table.Table({
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				width: "60rem",
				rows: "{/facturaSeleccionada}"
			});
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Posición"
				}),
				template: new sap.m.Text({
					text: "{POS}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Código"
				}),
				template: new sap.m.Text({
					text: "{COD}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe sin IGV"
				}),
				template: new sap.m.Text({
					text: "{TOTALSINUGV}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe con IGV"
				}),
				template: new sap.m.Text({
					text: "{NETO}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "20rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Descripción del material"
				}),
				template: new sap.m.Text({
					text: "{MATERIAL}"
				})
			}));
			oTable.setModel(myParam);*/

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
					text: "Fecha Ingreso"
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
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Documento/H.E.S."
				}),
				template: new sap.m.Text({
					text: "{VALE}"
				})
			}));

			oTableItem.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Guía remisión"
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
				width: "9rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe sin IGV"
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
			//hbox.addItem(oTable);
			var oDialogSelectItems = new sap.m.Dialog("idDialogSelectItems", {

				title: "Detalle de asignación",
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
								text: "Tabla de asignación por documento de ingreso"
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

					//var url = "/odatabnv/odata2.svc/";
					var url = "" + this.varTableURL + "/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
					var filters = [];
					var filter;
					filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, factura.ID_FACTURA);
					filters.push(filter);
					filter = new sap.ui.model.Filter("POS_FACTURA", sap.ui.model.FilterOperator.EQ, factura.POS_FACTURA);
					filters.push(filter);
					filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, varRUC);
					filters.push(filter);
					filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varUsuario);
					filters.push(filter);
					//oModel.read("/T_FAC_POSs?$format=json", {
					oModel.read("/" + this.varTableT_FAC_POS + "?$format=json", {
						filters: filters,
						success: function (response) {

							var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
							var lenghtV = oModelJSON.getData().length;
							myParam.setProperty("/clistItemsOrdenCompra", oModelJSON.getData());
							var total = 0;
							for (var i = 0; i < lenghtV; i++) {
								total += parseFloat(oModelJSON.getData()[i].PRECIO_ING.toString().replace(',', ''), 10);
							}
							total = total.toFixed(2);
							var subTotal = [];
							var llaveSub = {};
							llaveSub.total = total;
							subTotal.push(llaveSub);
							myParam.setProperty("/subTotal", subTotal);
							oTableItem.getBinding("rows").refresh(true);
							oTableSubTotal.getBinding("rows").refresh(true);

							///////////////////
							// Obtener los datos del Item selecconados
						}.bind(this),
						error: function (oError) {
							myParam.setProperty("/clistItemsOrdenCompra", []);
							myParam.setProperty("/subTotal", []);
							oTableItem.getBinding("rows").refresh(true);
							oTableSubTotal.getBinding("rows").refresh(true);
							// Mensaje de Alerta de que termino el tiempo de sesión
							var dialogMensajeSesion = new sap.m.Dialog({
								draggable: true,
								resizable: true,
								contentWidth: "auto",
								title: "Mensaje de alerta",
								content: [
									new sap.m.Label({
										text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
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

				}.bind(this)
			});

			oDialogSelectItems.open();
		},

		onAfterRendering: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			// Tablas
			this.varTableURL = oModel.getProperty("/listTablasOData/clistTablasODataURL");
			this.varTableDocumentConsultar = oModel.getProperty("/listTablasOData/clistTablasODataDocumentConsultar");
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
			this.getView().byId("idErrores").setVisible(false);
			this.getView().byId("idEliminar").setVisible(false);
			this.getView().byId("idListMaster1").removeSelections(true);
		},
		clicItemFactura: function (oEvent) {
			var oThis = this;
			this.getView().byId("detailF").setBusy(true);
			var oModel = oThis.getView().getModel("myParam");
			var itemSeleccionado = oEvent.getSource().getSelectedItem();
			var factura = itemSeleccionado.getBindingContext("myParam").getObject();
			var oModel2 = oThis.getView().getModel("myParam");
			var varUsuario = oModel2.getProperty("/usuarioLogin");
			var varRUC = oModel2.getProperty("/usuarioRuc");
			oModel.setProperty("/listConsultaResumenFactura", factura);
			if (factura.TIPO_CARGA !== "" && factura.TIPO_CARGA !== null && factura.TIPO_CARGA !== undefined) {
				if (factura.TIPO_CARGA === "M") {
					this.getView().byId("idDetalleItem").setVisible(false);
				} else {
					this.getView().byId("idDetalleItem").setVisible(false);
				}

			} else {
				this.getView().byId("idDetalleItem").setVisible(false);
			}

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);

			//Total sin IGV
			var calculo = parseFloat(factura.TOTAL_IMP) - parseFloat(factura.TOTAL_IGV);
			calculo = calculo.toFixed(2);
			this.getView().byId("idTotalSinIgv").setText(calculo);

			// Mostrar JSON
			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, factura.ID_FACTURA);
			filters.push(filter);
			filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, varRUC);
			filters.push(filter);
			filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varUsuario);
			filters.push(filter);
			//oModelOData.read("/T_FAC_DETs?$format=json", {
			oModelOData.read("/" + this.varTableT_FAC_DET + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					oModel.setProperty("/listItemFacturas", oModelJSON.getData());
					oModel.setProperty("/listItemFacturasLenght", lenghtV);
					this.getView().byId("idTableItemFacturas").getBinding("rows").refresh(true);
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listItemFacturas", []);
					oModel.setProperty("/listItemFacturasLenght", 0);
					this.getView().byId("idTableItemFacturas").getBinding("rows").refresh(true);
					// Mensaje de Alerta de que termino el tiempo de sesión
					var dialogMensajeSesion = new sap.m.Dialog({
						draggable: true,
						resizable: true,
						contentWidth: "auto",
						title: "Mensaje de alerta",
						content: [
							new sap.m.Label({
								text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
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
			//oModelOData.read("/T_FAC_POSs?$format=json", {
			oModelOData.read("/" + this.varTableT_FAC_POS + "?$format=json", {
				filters: filters,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					oModel.setProperty("/listItemFacturaPosicion", oModelJSON.getData());

				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listItemFacturaPosicion", []);
					// Mensaje de Alerta de que termino el tiempo de sesión
					var dialogMensajeSesion = new sap.m.Dialog({
						draggable: true,
						resizable: true,
						contentWidth: "auto",
						title: "Mensaje de alerta",
						content: [
							new sap.m.Label({
								text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
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
			//oModelOData.read("/T_DOCs?$format=json", {
			oModelOData.read("/" + this.varTableT_DOC + "?$format=json", {
				filters: filters,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

					var lenghtV = oModelJSON.getData().length;
					if (lenghtV === 0) {
						this.getView().byId("idLayoutDoc").setVisible(false);
						this.getView().byId("idToolbarNotFound").setVisible(true);
					} else {
						this.getView().byId("idLayoutDoc").setVisible(true);
						this.getView().byId("idToolbarNotFound").setVisible(false);
					}
					oModel.setProperty("/listDocAdjuntarFac", oModelJSON.getData());
					oModel.setProperty("/listDocAdjuntarFacLenght", lenghtV);
					this.getView().byId("detailF").setBusy(false);
					this.getView().byId("idListDocumentos").getBinding("items").refresh(true);
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listDocAdjuntarFac", []);
					oModel.setProperty("/listDocAdjuntarFacLenght", 0);
					this.getView().byId("detailF").setBusy(false);
					this.getView().byId("idListDocumentos").getBinding("items").refresh(true);
					// Mensaje de Alerta de que termino el tiempo de sesión
					var dialogMensajeSesion = new sap.m.Dialog({
						draggable: true,
						resizable: true,
						contentWidth: "auto",
						title: "Mensaje de alerta",
						content: [
							new sap.m.Label({
								text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
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
			this.getView().byId("idErrores").setVisible(false);
			this.getView().byId("idEliminar").setVisible(true);
			this.getView().byId("ohFac").setVisible(true);
			this.getView().byId("idTabBarFac").setVisible(true);

			///////////////////////////////////////////////
			var varEvaluarFecRegistro = factura.ESTADO;
			if (varEvaluarFecRegistro === "E") {
				this.funDialogFechaDeRegistro();
			} else if (varEvaluarFecRegistro === "A"){
				this.funDialogFechaDeRegistroDELETE();
			}
		},

		funDialogFechaDeRegistro: function () {

			var dialog2 = new sap.m.Dialog({
				title: 'Mensaje de Error',
				type: 'Message',
				state: 'Error',
				icon: "sap-icon://attachment",
				content: new sap.m.Text({
					text: "La factura no fue cargada correctamente, por favor eliminar y volverla a cargar."
				}),
				beginButton: new sap.m.Button({
					text: 'Aceptar',
					icon: "sap-icon://accept",
					type: "Reject",
					press: function () {
						dialog2.close();
					}
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		funDialogFechaDeRegistroDELETE: function () {

			var dialog2 = new sap.m.Dialog({
				title: 'Mensaje de Error',
				type: 'Message',
				state: 'Error',
				icon: "sap-icon://attachment",
				content: new sap.m.Text({
					text: "La factura no fue eliminada correctamente, por favor eliminar y volverla a cargar."
				}),
				beginButton: new sap.m.Button({
					text: 'Aceptar',
					icon: "sap-icon://accept",
					type: "Reject",
					press: function () {
						dialog2.close();
					}
				}),
				afterClose: function () {
					dialog2.destroy();
				}
			});
			dialog2.open();
		},
		inicioListaFacturas: function () {

			this.getView().byId("master1").setBusy(true);

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrix = [];
			var sorters = [];
			var factura = {};
			var sorter;
			var oThis = this;
			var oModel2 = oThis.getView().getModel("myParam");
			var varUsuario = oModel2.getProperty("/usuarioLogin");
			var varRUC = oModel2.getProperty("/usuarioRuc");
			var filterOrdenCompra = [];
			var filter;
			filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varUsuario);
			filterOrdenCompra.push(filter);
			filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, varRUC);
			filterOrdenCompra.push(filter);
			sorter = new sap.ui.model.Sorter("FC_FEC_REGISTRO", true);
			sorters.push(sorter);
			// Mostrar JSON
			//oModel.read("/T_FACs?$format=json", {
			oModel.read("/" + this.varTableT_FAC + "?$format=json", {
				filters: filterOrdenCompra,
				sorters: sorters,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

					var lenghtV = oModelJSON.getData().length;

					for (var i = 0; i < lenghtV; i++) {
						factura = {};
						factura.EM_RUC = oModelJSON.getData()[i].EM_RUC;
						factura.US_RUC = oModelJSON.getData()[i].US_RUC;
						factura.ID_FACTURA = oModelJSON.getData()[i].ID_FACTURA;
						factura.UBL = oModelJSON.getData()[i].UBL;
						factura.FC_FEC_EMISION = oModelJSON.getData()[i].FC_FEC_EMISION;
						factura.NOM_DEM_RAZ = oModelJSON.getData()[i].NOM_DEM_RAZ;
						factura.NOM_COMERCIAL = oModelJSON.getData()[i].NOM_COMERCIAL;
						factura.TIPO_DOC = oModelJSON.getData()[i].TIPO_DOC;
						factura.RUC_ADQ = oModelJSON.getData()[i].RUC_ADQ;
						factura.NOM_DEM_RAZ_ADQ = oModelJSON.getData()[i].NOM_DEM_RAZ_ADQ;
						factura.MONEDA = oModelJSON.getData()[i].MONEDA;
						factura.TASA_IGV = oModelJSON.getData()[i].TASA_IGV;
						factura.TOTAL_DESC = oModelJSON.getData()[i].TOTAL_DESC;
						factura.TOTAL_IGV = oModelJSON.getData()[i].TOTAL_IGV;
						factura.TOTAL_IMP = oModelJSON.getData()[i].TOTAL_IMP;
						factura.TIPO_CARGA = oModelJSON.getData()[i].TIPO_CARGA;
						factura.FC_FEC_REGISTRO = oModelJSON.getData()[i].FC_FEC_REGISTRO;
						factura.FC_HORA_REGISTRO = oModelJSON.getData()[i].FC_HORA_REGISTRO;
						factura.FC_USER_REGISTRO = oModelJSON.getData()[i].FC_USER_REGISTRO;
						factura.FEC_JOB = oModelJSON.getData()[i].FEC_JOB;
						factura.ESTADO = oModelJSON.getData()[i].ESTADO;
						factura.FEC_VENCIMIENTO = oModelJSON.getData()[i].FEC_VENCIMIENTO;
						factura.FEC_PAGO = oModelJSON.getData()[i].FEC_PAGO;
						matrix.push(factura);
					}

					oModel2.setProperty("/listFactura", matrix);
					this.getView().byId("idTituloOrden").setText("Facturas (" + lenghtV + ")");
					//oThis.getView().byId("idListMaster2").getBinding("items").refresh(true);
					this.getView().byId("master1").setBusy(false);
				}.bind(this),
				error: function (oError) {
					console.log(oError);
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
								text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
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
		formatTipoCarga: function (est) {
			if (est !== "" && est !== null && est !== undefined) {
				if (est === "N") {
					return "Consignación";
				} else if (est === "C") {
					return "Contratista";
				} else if (est === "V") {
					return "Nota de crédito";
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
				return "Sin Asignar";
			}
		},
		formatTipoEStado: function (est) {

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
				}else if (est === "A") {//GM26102021
					return "Por anular";
				}
			} else {
				return "Sin Asignar";
			}
		},
		formatTipoEStadoColor: function (est) {

			if (est !== "" && est !== null && est !== undefined) {
				if (est === "P") {
					return "Information";
				} else if (est === "C") {
					return "Information";
				} else if (est === "E") {
					return "Error";
				} else if (est === "O") {
					return "Error";
				}
			} else {
				return "Information";
			}
		},
		formatTipoCargaVisible: function (est) {
			if (est !== "" && est !== null && est !== undefined) {
				return true;
			} else {
				return false;
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
				title: "Lista de mensajes",
				resizable: true,
				draggable: true,
				content: oMessageView,
				state: 'Information',
				icon: "sap-icon://batch-payments",
				beginButton: new sap.m.Button({
					press: function () {
						dialogError.close();
					}.bind(this),
					text: "Cerrar"
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
		ressEliminarFacturaVerificar: function () {

			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");

			var varFechaJob = oModel.getProperty("/listConsultaResumenFactura/FEC_JOB");
			var varEstado = oModel.getProperty("/listConsultaResumenFactura/ESTADO");
			console.log(varFechaJob,varEstado);

			if ((varFechaJob === "" && varEstado === "P") || varEstado === "O" || varEstado === "P" || varEstado === "A" || varEstado === "E") { //varFechaJob !== "" || varEstado !== "P" o sino  || varEstado === "R"
				var objeto = this.getView().byId("ohFac").getBindingContext("myParam").getObject();
				var dialogMensaje = new sap.m.Dialog({
					draggable: true,
					resizable: true,
					contentWidth: "370px",
					title: "Mensaje de confirmación",
					content: [
						new sap.m.Label({
							text: "¿Está seguro de eliminar la factura " + objeto.ID_FACTURA + "?",
							wrapping: true,
							design: "Bold",
							width: "100%"
						}),
						new sap.m.Label({
							text: "El detalle, las posiciones y los documentos de la factura " + objeto.ID_FACTURA + " serán tambien borrados.",
							wrapping: true,
							width: "100%"
						})
					],
					state: "Error",
					type: "Message",
					beginButton: new sap.m.Button({
						press: function () {
							dialogMensaje.close();
							//this.ressEliminarFactura();
							this.ressEliminarFactura2();
						}.bind(this),
						text: "Aceptar"
					}),
					endButton: new sap.m.Button({
						press: function () {
							dialogMensaje.close();
						}.bind(this),
						text: "Cancelar"
					}),
					afterClose: function () {
						dialogMensaje.destroy();
					},

					verticalScrolling: false
				});
				dialogMensaje.open();
			} else {
				var dialog2 = new sap.m.Dialog({
					title: 'Alerta',
					type: 'Message',
					state: 'Warning',
					icon: "sap-icon://batch-payments",
					content: new sap.m.Text({
						text: "La Factura ya tiene tratamiento y no se puede eliminar"
					}),
					beginButton: new sap.m.Button({
						text: 'Aceptar',
						icon: "sap-icon://accept",
						type: "Emphasized",
						press: function () {
							dialog2.close();
						}.bind(this)
					}),
					afterClose: function () {
						dialog2.destroy();
					}
				});
				dialog2.open();
			}

		},
            _getDatadocsust: function (varTableDocumentConsultar, Nombre) {
                var oConsultaHistorica = [],
                    oData = {};
                $.ajax(varTableDocumentConsultar + Nombre, {
                    type: "GET",
                    async: false,
                    success: function (response) {
						response = response.toString();
						response = response.split("<t1>");
						response = response[1];
						response = response.split("</t1>");
						response = response[0];
						var vectorReg = response.split("|");
                        var oJSON =vectorReg
                        console.log(oJSON);
                        var oModel = new JSONModel({
                            consultaHistorica: oJSON
                        });

                        oConsultaHistorica = {
                            response: vectorReg
                        };
                    }.bind(this),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        oConsultaHistorica = false;
                        console.log("Status: " + textStatus);
                        console.log("Error: " + errorThrown);
                        console.log(XMLHttpRequest);
                    }
                });
                return oConsultaHistorica;
            },
            _DeleteDatarepo: function (Nombre,data) {
                var oConsultaHistorica = [],
                    oData = {};
					$.ajax("" + this.varTableDocument + "/" + Nombre, {
						type: 'POST',
						async: false,
						data: data,
						cache: false,
						processData: false,
						contentType: false,
						success: function (response) {	
						response = response.toString();
						console.log(response);
                        var oJSON ="V";
                        console.log(oJSON);

                        oConsultaHistorica ="V";
                    }.bind(this),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        oConsultaHistorica = "E";
                        console.log("Status: " + textStatus);
                        console.log("Error: " + errorThrown);
                        console.log(XMLHttpRequest);
                    }
                });
                return oConsultaHistorica;
            },
            _DeleteDataTDOC: function (documento) {
            	var url = "" + this.varTableURL + "/";
				var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);
                var oConsultaHistorica = [],
                    oData = {};
					oModelOData.remove(documento, {
					async: false,
					success: function (response) {	
						response = response.toString();
						console.log(response);
                        var oJSON ="V";
                        console.log(oJSON);

                        oConsultaHistorica ="V";
                    }.bind(this),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        oConsultaHistorica = "E";
                        console.log("Status: " + textStatus);
                        console.log("Error: " + errorThrown);
                        console.log(XMLHttpRequest);
                    }
                });
                return oConsultaHistorica;
            },	           
		ressEliminarFactura2: function () {
			
			this.getView().setBusy(true);

			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");
			this.varContTabla0 = 0;
			this.varContTabla1 = 0;
			this.varContTabla2 = 0;
			this.varContTabla3 = 0;
			this.varContTabla4 = 0;
			this.varContTabla5 = 0;
			this.varEstado0 = "V";
			this.varEstado1 = "V";
			this.varEstado2 = "V";
			this.varEstado3 = "V";
			this.varEstado4 = "V";

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);

			var listDocAdjuntarFac = oModel.getProperty("/listDocAdjuntarFac");
			var listItemFacturas = oModel.getProperty("/listItemFacturas");
			var listItemFacturaPosicion = oModel.getProperty("/listItemFacturaPosicion");
			var objeto = this.getView().byId("ohFac").getBindingContext("myParam").getObject();
			this.varObjeto1 = objeto;
			
		
			console.log(this.varObjeto1);
			console.log("Conteo T_DOC x 2: " + listDocAdjuntarFac.length);
			console.log("Conteo T_FAC_DET: " + listItemFacturas.length);
			console.log("Conteo T_FAC_POS: " + listItemFacturaPosicion.length);
			//oModel.setProperty("/listConsultaResumenFactura/ESTADO", "A");
			//this.getView().byId("idTotalSinIgv").setText(calculo);
			var llaveActualizarab = {};
			llaveActualizarab.ESTADO = "A";
			//var textocab = "/" + this.varTableT_FAC + "(EM_RUC='" + EM_RUC + "',US_RUC='" + US_RUC + "',ID_FACTURA='" + ID_FACTURA + "')";	
			var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
						"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
						"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
						"')";
			var data1 = {
				'cmisaction': 'delete'
			};
			var formData = new FormData();
			jQuery.each(data1, function (key, value) {
				formData.append(key, value);
			});
						
			oModelOData.update(ordenCompra, llaveActualizarab, {
				method: "PUT",
				success: function (data) {
						console.log("Update A en el t_Fac - exito");
						if (listDocAdjuntarFac.length !== 0) {
							for (var d1 = 0; d1 < listDocAdjuntarFac.length; d1++) {
									console.log("" + this.varTableDocument + "/" + listDocAdjuntarFac[d1].NOMBRE_DOC);
									console.log("" + this.varTableDocumentConsultar + "/" + listDocAdjuntarFac[d1].NOMBRE_DOC);
									var oConsultaDocResponse = this._getDatadocsust(this.varTableDocumentConsultar, listDocAdjuntarFac[d1].NOMBRE_DOC);
									var oConsultaDoc = oConsultaDocResponse.response;
									console.log(oConsultaDoc);
									if(oConsultaDoc.length>1&&oConsultaDoc!=false){
										console.log("REPOSITORIO ELIMINAR");
										
										var oDeleteDocRepo = this._DeleteDatarepo(listDocAdjuntarFac[d1].NOMBRE_DOC,formData);
										console.log(oDeleteDocRepo);
										
										if(oDeleteDocRepo =="V"){
											console.log("T_DOC ELIMINAR");
											var documento = "/" + this.varTableT_DOC + "(EM_RUC='" + listDocAdjuntarFac[d1].EM_RUC +
												"',US_RUC='" + listDocAdjuntarFac[d1].US_RUC +
												"',ID_FACTURA='" + listDocAdjuntarFac[d1].ID_FACTURA +
												"',POS_DOCUMENTO='" + listDocAdjuntarFac[d1].POS_DOCUMENTO + "')";
												console.log(documento);
												//var oDeleteDocRepo = this._DeleteDataTDOC(documento);													this.contPos = 0;
								            console.log(documento);
											oModelOData.remove(documento, {
													success: function (response) {
													this.varContTabla2++;
													if (this.varContTabla2 === listDocAdjuntarFac.length) {
														console.log("T_FAC_DET ELIMINAR");
														if(listItemFacturas.length === 0){
													
																
																	if(listItemFacturaPosicion.length === 0){
																										//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																										var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																											"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																											"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																											"')";
																										this.contPos = 0;
																										this.contOC = 0;
																										this.contDoc = 0;
																										console.log(ordenCompra);
																										oModelOData.remove(ordenCompra, {
																											success: function (response) {
																												console.log("EXITO EXTIO");
																												var dialogA = new sap.m.Dialog({
																													title: 'Éxito',
																													type: 'Message',
																													state: 'Success',
																													icon: "sap-icon://accept",
																													content: new sap.m.Text({
																														text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																													}),
																													beginButton: new sap.m.Button({
																														text: 'Aceptar',
																														icon: "sap-icon://accept",
																														type: "Accept",
																														press: function () {
																															dialogA.close();
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();
	
																												this.getView().setBusy(false);
																												this.getView().byId("idListMaster1").removeSelections(true);
																												var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																												oProductDetail1PanelCabecera.setVisible(false);
																												this.getView().byId("idEliminar").setVisible(false);
																												var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																												oProductDetail1PanelIconBar.setVisible(false);
																												this.inicioListaFacturas();
																											}.bind(this),
																											error: function (response) {
																												console.log(response);
																												var dialogA = new sap.m.Dialog({
																													title: 'Error',
																													type: 'Message',
																													state: 'Error',
																													icon: "sap-icon://error",
																													content: new sap.m.Text({
																														text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																															"' - ERROR: T_FAC."
																													}),
																													beginButton: new sap.m.Button({
																														text: 'Aceptar',
																														icon: "sap-icon://accept",
																														type: "Accept",
																														press: function () {
																															dialogA.close();
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();
	
																												this.getView().setBusy(false);
																												this.getView().byId("idListMaster1").removeSelections(true);
																												var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																												oProductDetail1PanelCabecera.setVisible(false);
																												this.getView().byId("idEliminar").setVisible(false);
																												var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																												oProductDetail1PanelIconBar.setVisible(false);
																												this.inicioListaFacturas();
																											}.bind(this),
																										});
																									
																	
																	}else{
																		console.log("T_OC_DET ACT");
																	for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																		var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																		if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																			//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																			var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																				"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																				"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION +
																				//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																				"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																				"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																				"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																				"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL + "')";
																			var llaveActualizar = {};
																			llaveActualizar.DE_FLAC = '';
																				console.log(actOrdenCompra);
																			oModelOData.update(actOrdenCompra, llaveActualizar, {
																				method: "PUT",
																				success: function (response) {
																				this.varContTabla4++;
																				if (this.varContTabla4 === listItemFacturaPosicion.length) {
																					
																					console.log("T_FAC_POS ELIMINA2R");
																							for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
																							//var detOrdenCompra = "/T_FAC_POSs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC +
																							var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																								"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																								"',ID_FACTURA='" + listItemFacturaPosicion[d4].ID_FACTURA +
																								"',POS_FACTURA='" + listItemFacturaPosicion[d4].POS_FACTURA +
																								"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																								"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																								"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																								"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL +
																								//"',GUIA_REMISION='" + listItemFacturaPosicion[d4].GUIA_REMISION +
																								"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION + "')";
																								console.log(detOrdenCompra);
																							oModelOData.remove(detOrdenCompra, {
																								success: function (data) {   
																									this.varContTabla5++;
																									if (this.varContTabla5 === listItemFacturaPosicion.length) {
																										console.log("T_FAC UPDATE");
																										//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																										var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																											"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																											"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																											"')";
																										this.contPos = 0;
																										this.contOC = 0;
																										this.contDoc = 0;
																										console.log(ordenCompra);
																										oModelOData.remove(ordenCompra, {
																											success: function (response) {
																												console.log("EXITO EXTIO");
																												var dialogA = new sap.m.Dialog({
																													title: 'Éxito',
																													type: 'Message',
																													state: 'Success',
																													icon: "sap-icon://accept",
																													content: new sap.m.Text({
																														text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																													}),
																													beginButton: new sap.m.Button({
																														text: 'Aceptar',
																														icon: "sap-icon://accept",
																														type: "Accept",
																														press: function () {
																															dialogA.close();
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();
	
																												this.getView().setBusy(false);
																												this.getView().byId("idListMaster1").removeSelections(true);
																												var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																												oProductDetail1PanelCabecera.setVisible(false);
																												this.getView().byId("idEliminar").setVisible(false);
																												var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																												oProductDetail1PanelIconBar.setVisible(false);
																												this.inicioListaFacturas();
																											}.bind(this),
																											error: function (response) {
																												console.log(response);
																												var dialogA = new sap.m.Dialog({
																													title: 'Error',
																													type: 'Message',
																													state: 'Error',
																													icon: "sap-icon://error",
																													content: new sap.m.Text({
																														text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																															"' - ERROR: T_FAC."
																													}),
																													beginButton: new sap.m.Button({
																														text: 'Aceptar',
																														icon: "sap-icon://accept",
																														type: "Accept",
																														press: function () {
																															dialogA.close();
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();
	
																												this.getView().setBusy(false);
																												this.getView().byId("idListMaster1").removeSelections(true);
																												var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																												oProductDetail1PanelCabecera.setVisible(false);
																												this.getView().byId("idEliminar").setVisible(false);
																												var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																												oProductDetail1PanelIconBar.setVisible(false);
																												this.inicioListaFacturas();
																											}.bind(this),
																										});
																									}
																								}.bind(this),
																								error: function (data) {
																									console.log(data);
																								}.bind(this)
																							});
																						}
																				
																				}
																			}.bind(this),
																			error: function (response) {
																				console.log(response);
																				if (this.varEstado4 === "V") {
																					this.varEstado4 = "E";
																					this.funValidarConteoDeRegistros();
																					this.getView().setBusy(false);
																					this.getView().byId("idListMaster1").removeSelections(true);
																					var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																					oProductDetail1PanelCabecera.setVisible(false);
																					this.getView().byId("idEliminar").setVisible(false);
																					var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																					oProductDetail1PanelIconBar.setVisible(false);
																					this.inicioListaFacturas();
																				}
																			}.bind(this)
																		});
																		}
																	}
																	}
																	
															
													
														}else{
																for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
														//var detOrdenCompra = "/T_FAC_DETs(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
														var detOrdenCompra = "/" + this.varTableT_FAC_DET + "(EM_RUC='" + listItemFacturas[d3].EM_RUC.toString() +
															"',US_RUC='" + listItemFacturas[d3].US_RUC.toString() +
															"',ID_FACTURA='" + listItemFacturas[d3].ID_FACTURA.toString() +
															"',POS_FACTURA='" + listItemFacturas[d3].POS_FACTURA.toString() +
															"')";
															console.log(detOrdenCompra);
														oModelOData.remove(detOrdenCompra, {
															success: function (response) {
																this.varContTabla3++;
																if (this.varContTabla3 === listItemFacturas.length) {
																	console.log("T_FAC_POS ELIMINAR");////GM26102021 inicio
																	if(listItemFacturaPosicion.length === 0){
																			//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																			var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																				"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																				"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																				"')";
																			this.contPos = 0;
																			this.contOC = 0;
																			this.contDoc = 0;
																			console.log(ordenCompra);
																			oModelOData.remove(ordenCompra, {
																				success: function (response) {
																					console.log("EXITO EXTIO");
																					var dialogA = new sap.m.Dialog({
																						title: 'Éxito',
																						type: 'Message',
																						state: 'Success',
																						icon: "sap-icon://accept",
																						content: new sap.m.Text({
																							text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																						}),
																						beginButton: new sap.m.Button({
																							text: 'Aceptar',
																							icon: "sap-icon://accept",
																							type: "Accept",
																							press: function () {
																								dialogA.close();
																							}.bind(this)
																						}),
																						afterClose: function () {
																							dialogA.destroy();
																						}
																					});
																					dialogA.open();

																					this.getView().setBusy(false);
																					this.getView().byId("idListMaster1").removeSelections(true);
																					var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																					oProductDetail1PanelCabecera.setVisible(false);
																					this.getView().byId("idEliminar").setVisible(false);
																					var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																					oProductDetail1PanelIconBar.setVisible(false);
																					this.inicioListaFacturas();
																				}.bind(this),
																				error: function (response) {
																					console.log(response);
																					var dialogA = new sap.m.Dialog({
																						title: 'Error',
																						type: 'Message',
																						state: 'Error',
																						icon: "sap-icon://error",
																						content: new sap.m.Text({
																							text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																								"' - ERROR: T_FAC."
																						}),
																						beginButton: new sap.m.Button({
																							text: 'Aceptar',
																							icon: "sap-icon://accept",
																							type: "Accept",
																							press: function () {
																								dialogA.close();
																							}.bind(this)
																						}),
																						afterClose: function () {
																							dialogA.destroy();
																						}
																					});
																					dialogA.open();

																					this.getView().setBusy(false);
																					this.getView().byId("idListMaster1").removeSelections(true);
																					var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																					oProductDetail1PanelCabecera.setVisible(false);
																					this.getView().byId("idEliminar").setVisible(false);
																					var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																					oProductDetail1PanelIconBar.setVisible(false);
																					this.inicioListaFacturas();
																				}.bind(this),
																			});																		
																	}else{////GM26102021 fin
																		console.log("T_OC_DET ACT");
																		for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																		var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																		if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																			//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																			var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																				"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																				"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION +
																				//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																				"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																				"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																				"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																				"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL + "')";
																			var llaveActualizar = {};
																			llaveActualizar.DE_FLAC = '';
																				console.log(actOrdenCompra);
																			oModelOData.update(actOrdenCompra, llaveActualizar, {
																				method: "PUT",
																				success: function (response) {
																				this.varContTabla4++;
																				if (this.varContTabla4 === listItemFacturaPosicion.length) {
																					
																					console.log("T_FAC_POS ELIMINA2R");
																							for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
																							//var detOrdenCompra = "/T_FAC_POSs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC +
																							var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																								"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																								"',ID_FACTURA='" + listItemFacturaPosicion[d4].ID_FACTURA +
																								"',POS_FACTURA='" + listItemFacturaPosicion[d4].POS_FACTURA +
																								"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																								"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																								"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																								"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL +
																								//"',GUIA_REMISION='" + listItemFacturaPosicion[d4].GUIA_REMISION +
																								"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION + "')";
																								console.log(detOrdenCompra);
																							oModelOData.remove(detOrdenCompra, {
																								success: function (data) {   
																									this.varContTabla5++;
																									if (this.varContTabla5 === listItemFacturaPosicion.length) {
																										console.log("T_FAC UPDATE");
																										//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																										var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																											"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																											"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																											"')";
																										this.contPos = 0;
																										this.contOC = 0;
																										this.contDoc = 0;
																										console.log(ordenCompra);
																										oModelOData.remove(ordenCompra, {
																											success: function (response) {
																												console.log("EXITO EXTIO");
																												var dialogA = new sap.m.Dialog({
																													title: 'Éxito',
																													type: 'Message',
																													state: 'Success',
																													icon: "sap-icon://accept",
																													content: new sap.m.Text({
																														text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																													}),
																													beginButton: new sap.m.Button({
																														text: 'Aceptar',
																														icon: "sap-icon://accept",
																														type: "Accept",
																														press: function () {
																															dialogA.close();
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();
	
																												this.getView().setBusy(false);
																												this.getView().byId("idListMaster1").removeSelections(true);
																												var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																												oProductDetail1PanelCabecera.setVisible(false);
																												this.getView().byId("idEliminar").setVisible(false);
																												var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																												oProductDetail1PanelIconBar.setVisible(false);
																												this.inicioListaFacturas();
																											}.bind(this),
																											error: function (response) {
																												console.log(response);
																												var dialogA = new sap.m.Dialog({
																													title: 'Error',
																													type: 'Message',
																													state: 'Error',
																													icon: "sap-icon://error",
																													content: new sap.m.Text({
																														text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																															"' - ERROR: T_FAC."
																													}),
																													beginButton: new sap.m.Button({
																														text: 'Aceptar',
																														icon: "sap-icon://accept",
																														type: "Accept",
																														press: function () {
																															dialogA.close();
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();
	
																												this.getView().setBusy(false);
																												this.getView().byId("idListMaster1").removeSelections(true);
																												var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																												oProductDetail1PanelCabecera.setVisible(false);
																												this.getView().byId("idEliminar").setVisible(false);
																												var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																												oProductDetail1PanelIconBar.setVisible(false);
																												this.inicioListaFacturas();
																											}.bind(this),
																										});
																									}
																								}.bind(this),
																								error: function (data) {
																									console.log(data);
																								}.bind(this)
																							});
																						}
																				
																				}
																			}.bind(this),
																			error: function (response) {
																				console.log(response);
																				if (this.varEstado4 === "V") {
																					this.varEstado4 = "E";
																					this.funValidarConteoDeRegistros();
																					this.getView().setBusy(false);
																					this.getView().byId("idListMaster1").removeSelections(true);
																					var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																					oProductDetail1PanelCabecera.setVisible(false);
																					this.getView().byId("idEliminar").setVisible(false);
																					var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																					oProductDetail1PanelIconBar.setVisible(false);
																					this.inicioListaFacturas();
																				}
																			}.bind(this)
																		});
																		}
																	}																		
																	}

																}
															}.bind(this),
															error: function (response) {
																console.log(response);
																if (this.varEstado3 === "V") {
																	this.varEstado3 = "E";
																	this.funValidarConteoDeRegistros();
																	this.getView().setBusy(false);
																	this.getView().byId("idListMaster1").removeSelections(true);
																	var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																	oProductDetail1PanelCabecera.setVisible(false);
																	this.getView().byId("idEliminar").setVisible(false);
																	var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																	oProductDetail1PanelIconBar.setVisible(false);
																	this.inicioListaFacturas();
																}
															}.bind(this)
														});
													}
														}
												
												}															
													}.bind(this),
													error: function (response) {
													console.log(response);
													if (this.varEstado1 === "V") {
														this.varEstado1 = "E";
														this.funValidarConteoDeRegistros();
														this.getView().setBusy(false);
														this.getView().byId("idListMaster1").removeSelections(true);
														var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
														oProductDetail1PanelCabecera.setVisible(false);
														this.getView().byId("idEliminar").setVisible(false);
														var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
														oProductDetail1PanelIconBar.setVisible(false);
														this.inicioListaFacturas();
													}
												}.bind(this)
											});
												
										}else{
												this.varEstado0 = "E";
												this.funValidarConteoDeRegistros();
												this.getView().setBusy(false);
												this.getView().byId("idListMaster1").removeSelections(true);
												var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
												oProductDetail1PanelCabecera.setVisible(false);
												this.getView().byId("idEliminar").setVisible(false);
												var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
												oProductDetail1PanelIconBar.setVisible(false);
												this.inicioListaFacturas();
										}
									
									}else{
										console.log("T_DOC ELIMINAR");
												var documento = "/" + this.varTableT_DOC + "(EM_RUC='" + listDocAdjuntarFac[d1].EM_RUC +
													"',US_RUC='" + listDocAdjuntarFac[d1].US_RUC +
													"',ID_FACTURA='" + listDocAdjuntarFac[d1].ID_FACTURA +
													"',POS_DOCUMENTO='" + listDocAdjuntarFac[d1].POS_DOCUMENTO + "')";
													console.log(documento);
												console.log(documento);
												//var oDeleteDocRepo = this._DeleteDataTDOC(documento);
												//console.log(oDeleteDocRepo);
												oModelOData.remove(documento, {
													success: function (response) {
													this.varContTabla2++;
													if (this.varContTabla2 === listDocAdjuntarFac.length) {
														
																console.log("T_FAC_DET ELIMINAR");
																if(listItemFacturas.length === 0){
															
																			console.log("T_FAC_POS ELIMINAR");
																			if(listItemFacturaPosicion.length === 0){
																												//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																												var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																													"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																													"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																													"')";
																												this.contPos = 0;
																												this.contOC = 0;
																												this.contDoc = 0;
																												console.log(ordenCompra);
																												oModelOData.remove(ordenCompra, {
																													success: function (response) {
																														console.log("EXITO EXTIO");
																														var dialogA = new sap.m.Dialog({
																															title: 'Éxito',
																															type: 'Message',
																															state: 'Success',
																															icon: "sap-icon://accept",
																															content: new sap.m.Text({
																																text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																															}),
																															beginButton: new sap.m.Button({
																																text: 'Aceptar',
																																icon: "sap-icon://accept",
																																type: "Accept",
																																press: function () {
																																	dialogA.close();
																																}.bind(this)
																															}),
																															afterClose: function () {
																																dialogA.destroy();
																															}
																														});
																														dialogA.open();
			
																														this.getView().setBusy(false);
																														this.getView().byId("idListMaster1").removeSelections(true);
																														var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																														oProductDetail1PanelCabecera.setVisible(false);
																														this.getView().byId("idEliminar").setVisible(false);
																														var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																														oProductDetail1PanelIconBar.setVisible(false);
																														this.inicioListaFacturas();
																													}.bind(this),
																													error: function (response) {
																														console.log(response);
																														var dialogA = new sap.m.Dialog({
																															title: 'Error',
																															type: 'Message',
																															state: 'Error',
																															icon: "sap-icon://error",
																															content: new sap.m.Text({
																																text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																																	"' - ERROR: T_FAC."
																															}),
																															beginButton: new sap.m.Button({
																																text: 'Aceptar',
																																icon: "sap-icon://accept",
																																type: "Accept",
																																press: function () {
																																	dialogA.close();
																																}.bind(this)
																															}),
																															afterClose: function () {
																																dialogA.destroy();
																															}
																														});
																														dialogA.open();
			
																														this.getView().setBusy(false);
																														this.getView().byId("idListMaster1").removeSelections(true);
																														var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																														oProductDetail1PanelCabecera.setVisible(false);
																														this.getView().byId("idEliminar").setVisible(false);
																														var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																														oProductDetail1PanelIconBar.setVisible(false);
																														this.inicioListaFacturas();
																													}.bind(this),
																												});
																											
																			
																			}else{
																				console.log("T_OC_DET ACT");
																				for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																					var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																					if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																						//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																						var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																							"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																							"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION +
																							//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																							"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																							"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																							"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																							"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL + "')";
																						var llaveActualizar = {};
																						llaveActualizar.DE_FLAC = '';
																							console.log(actOrdenCompra);
																						oModelOData.update(actOrdenCompra, llaveActualizar, {
																							method: "PUT",
																							success: function (response) {
																							this.varContTabla4++;
																							if (this.varContTabla4 === listItemFacturaPosicion.length) {
																								
																								console.log("T_FAC_POS ELIMINA2R");
																										for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
																										//var detOrdenCompra = "/T_FAC_POSs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC +
																										var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																											"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																											"',ID_FACTURA='" + listItemFacturaPosicion[d4].ID_FACTURA +
																											"',POS_FACTURA='" + listItemFacturaPosicion[d4].POS_FACTURA +
																											"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																											"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																											"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																											"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL +
																											//"',GUIA_REMISION='" + listItemFacturaPosicion[d4].GUIA_REMISION +
																											"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION + "')";
																											console.log(detOrdenCompra);
																										oModelOData.remove(detOrdenCompra, {
																											success: function (data) {   
																												this.varContTabla5++;
																												if (this.varContTabla5 === listItemFacturaPosicion.length) {
																													console.log("T_FAC UPDATE");
																													//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																													var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																														"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																														"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																														"')";
																													this.contPos = 0;
																													this.contOC = 0;
																													this.contDoc = 0;
																													console.log(ordenCompra);
																													oModelOData.remove(ordenCompra, {
																														success: function (response) {
																															console.log("EXITO EXTIO");
																															var dialogA = new sap.m.Dialog({
																																title: 'Éxito',
																																type: 'Message',
																																state: 'Success',
																																icon: "sap-icon://accept",
																																content: new sap.m.Text({
																																	text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																																}),
																																beginButton: new sap.m.Button({
																																	text: 'Aceptar',
																																	icon: "sap-icon://accept",
																																	type: "Accept",
																																	press: function () {
																																		dialogA.close();
																																	}.bind(this)
																																}),
																																afterClose: function () {
																																	dialogA.destroy();
																																}
																															});
																															dialogA.open();
				
																															this.getView().setBusy(false);
																															this.getView().byId("idListMaster1").removeSelections(true);
																															var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																															oProductDetail1PanelCabecera.setVisible(false);
																															this.getView().byId("idEliminar").setVisible(false);
																															var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																															oProductDetail1PanelIconBar.setVisible(false);
																															this.inicioListaFacturas();
																														}.bind(this),
																														error: function (response) {
																															console.log(response);
																															var dialogA = new sap.m.Dialog({
																																title: 'Error',
																																type: 'Message',
																																state: 'Error',
																																icon: "sap-icon://error",
																																content: new sap.m.Text({
																																	text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																																		"' - ERROR: T_FAC."
																																}),
																																beginButton: new sap.m.Button({
																																	text: 'Aceptar',
																																	icon: "sap-icon://accept",
																																	type: "Accept",
																																	press: function () {
																																		dialogA.close();
																																	}.bind(this)
																																}),
																																afterClose: function () {
																																	dialogA.destroy();
																																}
																															});
																															dialogA.open();
				
																															this.getView().setBusy(false);
																															this.getView().byId("idListMaster1").removeSelections(true);
																															var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																															oProductDetail1PanelCabecera.setVisible(false);
																															this.getView().byId("idEliminar").setVisible(false);
																															var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																															oProductDetail1PanelIconBar.setVisible(false);
																															this.inicioListaFacturas();
																														}.bind(this),
																													});
																												}
																											}.bind(this),
																											error: function (data) {
																												console.log(data);
																											}.bind(this)
																										});
																									}
																							
																							}
																						}.bind(this),
																						error: function (response) {
																							console.log(response);
																							if (this.varEstado4 === "V") {
																								this.varEstado4 = "E";
																								this.funValidarConteoDeRegistros();
																								this.getView().setBusy(false);
																								this.getView().byId("idListMaster1").removeSelections(true);
																								var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																								oProductDetail1PanelCabecera.setVisible(false);
																								this.getView().byId("idEliminar").setVisible(false);
																								var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																								oProductDetail1PanelIconBar.setVisible(false);
																								this.inicioListaFacturas();
																							}
																						}.bind(this)
																					});
																					}
																				}
																			}
																			
																	
															
																}else{
																		for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
																//var detOrdenCompra = "/T_FAC_DETs(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
																var detOrdenCompra = "/" + this.varTableT_FAC_DET + "(EM_RUC='" + listItemFacturas[d3].EM_RUC.toString() +
																	"',US_RUC='" + listItemFacturas[d3].US_RUC.toString() +
																	"',ID_FACTURA='" + listItemFacturas[d3].ID_FACTURA.toString() +
																	"',POS_FACTURA='" + listItemFacturas[d3].POS_FACTURA.toString() +
																	"')";
																	console.log(detOrdenCompra);
																oModelOData.remove(detOrdenCompra, {
																	success: function (response) {
																		this.varContTabla3++;
																		if (this.varContTabla3 === listItemFacturas.length) {
																			console.log("T_FAC_POS ELIMINAR");////GM26102021 inicio
																			if(listItemFacturaPosicion.length === 0){
																				//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																				var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																					"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																					"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																					"')";
																				this.contPos = 0;
																				this.contOC = 0;
																				this.contDoc = 0;
																				console.log(ordenCompra);
																				oModelOData.remove(ordenCompra, {
																					success: function (response) {
																						console.log("EXITO EXTIO");
																						var dialogA = new sap.m.Dialog({
																							title: 'Éxito',
																							type: 'Message',
																							state: 'Success',
																							icon: "sap-icon://accept",
																							content: new sap.m.Text({
																								text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																							}),
																							beginButton: new sap.m.Button({
																								text: 'Aceptar',
																								icon: "sap-icon://accept",
																								type: "Accept",
																								press: function () {
																									dialogA.close();
																								}.bind(this)
																							}),
																							afterClose: function () {
																								dialogA.destroy();
																							}
																						});
																						dialogA.open();

																						this.getView().setBusy(false);
																						this.getView().byId("idListMaster1").removeSelections(true);
																						var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																						oProductDetail1PanelCabecera.setVisible(false);
																						this.getView().byId("idEliminar").setVisible(false);
																						var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																						oProductDetail1PanelIconBar.setVisible(false);
																						this.inicioListaFacturas();
																					}.bind(this),
																					error: function (response) {
																						console.log(response);
																						var dialogA = new sap.m.Dialog({
																							title: 'Error',
																							type: 'Message',
																							state: 'Error',
																							icon: "sap-icon://error",
																							content: new sap.m.Text({
																								text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																									"' - ERROR: T_FAC."
																							}),
																							beginButton: new sap.m.Button({
																								text: 'Aceptar',
																								icon: "sap-icon://accept",
																								type: "Accept",
																								press: function () {
																									dialogA.close();
																								}.bind(this)
																							}),
																							afterClose: function () {
																								dialogA.destroy();
																							}
																						});
																						dialogA.open();

																						this.getView().setBusy(false);
																						this.getView().byId("idListMaster1").removeSelections(true);
																						var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																						oProductDetail1PanelCabecera.setVisible(false);
																						this.getView().byId("idEliminar").setVisible(false);
																						var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																						oProductDetail1PanelIconBar.setVisible(false);
																						this.inicioListaFacturas();
																					}.bind(this),
																				});																				
																			}else{////GM26102021 fin
																				console.log("T_OC_DET ACT");
																				for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																					var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																					if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																						//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																						var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																							"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																							"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION +
																							//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																							"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																							"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																							"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																							"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL + "')";
																						var llaveActualizar = {};
																						llaveActualizar.DE_FLAC = '';
																							console.log(actOrdenCompra);
																						oModelOData.update(actOrdenCompra, llaveActualizar, {
																							method: "PUT",
																							success: function (response) {
																							this.varContTabla4++;
																							if (this.varContTabla4 === listItemFacturaPosicion.length) {
																								
																								console.log("T_FAC_POS ELIMINA2R");
																										for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
																										//var detOrdenCompra = "/T_FAC_POSs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC +
																										var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																											"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																											"',ID_FACTURA='" + listItemFacturaPosicion[d4].ID_FACTURA +
																											"',POS_FACTURA='" + listItemFacturaPosicion[d4].POS_FACTURA +
																											"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																											"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																											"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																											"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL +
																											//"',GUIA_REMISION='" + listItemFacturaPosicion[d4].GUIA_REMISION +
																											"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION + "')";
																											console.log(detOrdenCompra);
																										oModelOData.remove(detOrdenCompra, {
																											success: function (data) {   
																												this.varContTabla5++;
																												if (this.varContTabla5 === listItemFacturaPosicion.length) {
																													console.log("T_FAC UPDATE");
																													//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																													var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																														"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																														"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																														"')";
																													this.contPos = 0;
																													this.contOC = 0;
																													this.contDoc = 0;
																													console.log(ordenCompra);
																													oModelOData.remove(ordenCompra, {
																														success: function (response) {
																															console.log("EXITO EXTIO");
																															var dialogA = new sap.m.Dialog({
																																title: 'Éxito',
																																type: 'Message',
																																state: 'Success',
																																icon: "sap-icon://accept",
																																content: new sap.m.Text({
																																	text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																																}),
																																beginButton: new sap.m.Button({
																																	text: 'Aceptar',
																																	icon: "sap-icon://accept",
																																	type: "Accept",
																																	press: function () {
																																		dialogA.close();
																																	}.bind(this)
																																}),
																																afterClose: function () {
																																	dialogA.destroy();
																																}
																															});
																															dialogA.open();
				
																															this.getView().setBusy(false);
																															this.getView().byId("idListMaster1").removeSelections(true);
																															var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																															oProductDetail1PanelCabecera.setVisible(false);
																															this.getView().byId("idEliminar").setVisible(false);
																															var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																															oProductDetail1PanelIconBar.setVisible(false);
																															this.inicioListaFacturas();
																														}.bind(this),
																														error: function (response) {
																															console.log(response);
																															var dialogA = new sap.m.Dialog({
																																title: 'Error',
																																type: 'Message',
																																state: 'Error',
																																icon: "sap-icon://error",
																																content: new sap.m.Text({
																																	text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																																		"' - ERROR: T_FAC."
																																}),
																																beginButton: new sap.m.Button({
																																	text: 'Aceptar',
																																	icon: "sap-icon://accept",
																																	type: "Accept",
																																	press: function () {
																																		dialogA.close();
																																	}.bind(this)
																																}),
																																afterClose: function () {
																																	dialogA.destroy();
																																}
																															});
																															dialogA.open();
				
																															this.getView().setBusy(false);
																															this.getView().byId("idListMaster1").removeSelections(true);
																															var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																															oProductDetail1PanelCabecera.setVisible(false);
																															this.getView().byId("idEliminar").setVisible(false);
																															var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																															oProductDetail1PanelIconBar.setVisible(false);
																															this.inicioListaFacturas();
																														}.bind(this),
																													});
																												}
																											}.bind(this),
																											error: function (data) {
																												console.log(data);
																											}.bind(this)
																										});
																									}
																							
																							}
																						}.bind(this),
																						error: function (response) {
																							console.log(response);
																							if (this.varEstado4 === "V") {
																								this.varEstado4 = "E";
																								this.funValidarConteoDeRegistros();
																								this.getView().setBusy(false);
																								this.getView().byId("idListMaster1").removeSelections(true);
																								var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																								oProductDetail1PanelCabecera.setVisible(false);
																								this.getView().byId("idEliminar").setVisible(false);
																								var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																								oProductDetail1PanelIconBar.setVisible(false);
																								this.inicioListaFacturas();
																							}
																						}.bind(this)
																					});
																					}
																				}																				
																			}

																		}
																	}.bind(this),
																	error: function (response) {
																		console.log(response);
																		if (this.varEstado3 === "V") {
																			this.varEstado3 = "E";
																			this.funValidarConteoDeRegistros();
																			this.getView().setBusy(false);
																			this.getView().byId("idListMaster1").removeSelections(true);
																			var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																			oProductDetail1PanelCabecera.setVisible(false);
																			this.getView().byId("idEliminar").setVisible(false);
																			var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																			oProductDetail1PanelIconBar.setVisible(false);
																			this.inicioListaFacturas();
																		}
																	}.bind(this)
																});
															}
																}
														
														}	
													}.bind(this),
													error: function (response) {
														console.log(response);
														if (this.varEstado1 === "V") {
															this.varEstado1 = "E";
															this.funValidarConteoDeRegistros();
															this.getView().setBusy(false);
															this.getView().byId("idListMaster1").removeSelections(true);
															var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
															oProductDetail1PanelCabecera.setVisible(false);
															this.getView().byId("idEliminar").setVisible(false);
															var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
															oProductDetail1PanelIconBar.setVisible(false);
															this.inicioListaFacturas();
														}
													}.bind(this)
												});
											
									}
								
									
							}
							
						} else {
							console.log("OTRO");
							if (listItemFacturas.length !== 0) {
								for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
									//var detOrdenCompra = "/T_FAC_DETs(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
									var detOrdenCompra = "/" + this.varTableT_FAC_DET + "(EM_RUC='" + listItemFacturas[d3].EM_RUC.toString() +
										"',US_RUC='" + listItemFacturas[d3].US_RUC.toString() +
										"',ID_FACTURA='" + listItemFacturas[d3].ID_FACTURA.toString() +
										"',POS_FACTURA='" + listItemFacturas[d3].POS_FACTURA.toString() +
										"')";
									oModelOData.remove(detOrdenCompra, {
										success: function (response) {
											this.varContTabla3++;
											if (this.varContTabla3 === listItemFacturas.length) {
												for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
													//var detOrdenCompra = "/T_FAC_POSs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC +
													var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
														"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
														"',ID_FACTURA='" + listItemFacturaPosicion[d4].ID_FACTURA +
														"',POS_FACTURA='" + listItemFacturaPosicion[d4].POS_FACTURA +
														"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
														"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
														"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
														"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL +
														//"',GUIA_REMISION='" + listItemFacturaPosicion[d4].GUIA_REMISION +
														"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION + "')";
													oModelOData.remove(detOrdenCompra, {
														success: function (response) {
															this.varContTabla4++;
															if (this.varContTabla4 === listItemFacturaPosicion.length) {
																for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																	var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																	if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																		//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																		var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																			"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																			"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION +
																			//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																			"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																			"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																			"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																			"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL + "')";
																		var llaveActualizar = {};
																		llaveActualizar.DE_FLAC = '';
																		oModelOData.update(actOrdenCompra, llaveActualizar, {
																			method: "PUT",
																			success: function (data) {
																				this.varContTabla5++;
																				if (this.varContTabla5 === listItemFacturaPosicion.length) {
																					//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																					var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																						"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																						"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																						"')";
																					this.contPos = 0;
																					this.contOC = 0;
																					this.contDoc = 0;
																					oModelOData.remove(ordenCompra, {
																						success: function (response) {
																							var dialogA = new sap.m.Dialog({
																								title: 'Éxito',
																								type: 'Message',
																								state: 'Success',
																								icon: "sap-icon://accept",
																								content: new sap.m.Text({
																									text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																								}),
																								beginButton: new sap.m.Button({
																									text: 'Aceptar',
																									icon: "sap-icon://accept",
																									type: "Accept",
																									press: function () {
																										dialogA.close();
																									}.bind(this)
																								}),
																								afterClose: function () {
																									dialogA.destroy();
																								}
																							});
																							dialogA.open();
			
																							this.getView().setBusy(false);
																							this.getView().byId("idListMaster1").removeSelections(true);
																							var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																							oProductDetail1PanelCabecera.setVisible(false);
																							this.getView().byId("idEliminar").setVisible(false);
																							var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																							oProductDetail1PanelIconBar.setVisible(false);
																							this.inicioListaFacturas();
																						}.bind(this),
																						error: function (response) {
																							var dialogA = new sap.m.Dialog({
																								title: 'Error',
																								type: 'Message',
																								state: 'Error',
																								icon: "sap-icon://error",
																								content: new sap.m.Text({
																									text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																										"' - ERROR: T_FAC."
																								}),
																								beginButton: new sap.m.Button({
																									text: 'Aceptar',
																									icon: "sap-icon://accept",
																									type: "Accept",
																									press: function () {
																										dialogA.close();
																									}.bind(this)
																								}),
																								afterClose: function () {
																									dialogA.destroy();
																								}
																							});
																							dialogA.open();
			
																							this.getView().byId("idErrores").setVisible(true);
																							this.getView().setBusy(false);
																							this.getView().byId("idListMaster1").removeSelections(true);
																							var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																							oProductDetail1PanelCabecera.setVisible(false);
																							this.getView().byId("idEliminar").setVisible(false);
																							var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																							oProductDetail1PanelIconBar.setVisible(false);
																							this.inicioListaFacturas();
																						}.bind(this),
																					});
																				}
																			}.bind(this),
																			error: function (data) {
																			}
																		});
																	}
																}
															}
														}.bind(this),
														error: function (response) {
															if (this.varEstado4 === "V") {
																this.varEstado4 = "E";
																this.funValidarConteoDeRegistros();
																this.getView().setBusy(false);
																this.getView().byId("idListMaster1").removeSelections(true);
																var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																oProductDetail1PanelCabecera.setVisible(false);
																this.getView().byId("idEliminar").setVisible(false);
																var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																oProductDetail1PanelIconBar.setVisible(false);
																this.inicioListaFacturas();
															}
														}.bind(this)
													});
												}
											}
										}.bind(this),
										error: function (response) {
											if (this.varEstado3 === "V") {
												this.varEstado3 = "E";
												this.funValidarConteoDeRegistros();
												this.getView().setBusy(false);
												this.getView().byId("idListMaster1").removeSelections(true);
												var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
												oProductDetail1PanelCabecera.setVisible(false);
												this.getView().byId("idEliminar").setVisible(false);
												var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
												oProductDetail1PanelIconBar.setVisible(false);
												this.inicioListaFacturas();
											}
										}.bind(this)
									});
								}
							} else {
								if (listItemFacturaPosicion.length !== 0) {
									for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
										//var detOrdenCompra = "/T_FAC_POSs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC +
										var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
											"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
											"',ID_FACTURA='" + listItemFacturaPosicion[d4].ID_FACTURA +
											"',POS_FACTURA='" + listItemFacturaPosicion[d4].POS_FACTURA +
											"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
											"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
											"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
											"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL +
											//"',GUIA_REMISION='" + listItemFacturaPosicion[d4].GUIA_REMISION +
											"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION + "')";
										oModelOData.remove(detOrdenCompra, {
											success: function (response) {
												this.varContTabla4++;
												if (this.varContTabla4 === listItemFacturaPosicion.length) {
													for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
														var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
														if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
															//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
															var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION +
																//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL + "')";
															var llaveActualizar = {};
															llaveActualizar.DE_FLAC = '';
															oModelOData.update(actOrdenCompra, llaveActualizar, {
																method: "PUT",
																success: function (data) {
																	this.varContTabla5++;
																	if (this.varContTabla5 === listItemFacturaPosicion.length) {
																		//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
																		var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
																			"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
																			"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
																			"')";
																		this.contPos = 0;
																		this.contOC = 0;
																		this.contDoc = 0;
																		oModelOData.remove(ordenCompra, {
																			success: function (response) {
																				var dialogA = new sap.m.Dialog({
																					title: 'Éxito',
																					type: 'Message',
																					state: 'Success',
																					icon: "sap-icon://accept",
																					content: new sap.m.Text({
																						text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
																					}),
																					beginButton: new sap.m.Button({
																						text: 'Aceptar',
																						icon: "sap-icon://accept",
																						type: "Accept",
																						press: function () {
																							dialogA.close();
																						}.bind(this)
																					}),
																					afterClose: function () {
																						dialogA.destroy();
																					}
																				});
																				dialogA.open();
			
																				this.getView().setBusy(false);
																				this.getView().byId("idListMaster1").removeSelections(true);
																				var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																				oProductDetail1PanelCabecera.setVisible(false);
																				this.getView().byId("idEliminar").setVisible(false);
																				var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																				oProductDetail1PanelIconBar.setVisible(false);
																				this.inicioListaFacturas();
																			}.bind(this),
																			error: function (response) {
																				var dialogA = new sap.m.Dialog({
																					title: 'Error',
																					type: 'Message',
																					state: 'Error',
																					icon: "sap-icon://error",
																					content: new sap.m.Text({
																						text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
																							"' - ERROR: T_FAC."
																					}),
																					beginButton: new sap.m.Button({
																						text: 'Aceptar',
																						icon: "sap-icon://accept",
																						type: "Accept",
																						press: function () {
																							dialogA.close();
																						}.bind(this)
																					}),
																					afterClose: function () {
																						dialogA.destroy();
																					}
																				});
																				dialogA.open();
			
																				this.getView().byId("idErrores").setVisible(true);
																				this.getView().setBusy(false);
																				this.getView().byId("idListMaster1").removeSelections(true);
																				var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
																				oProductDetail1PanelCabecera.setVisible(false);
																				this.getView().byId("idEliminar").setVisible(false);
																				var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
																				oProductDetail1PanelIconBar.setVisible(false);
																				this.inicioListaFacturas();
																			}.bind(this),
																		});
																	}
																}.bind(this),
																error: function (data) {
																}
															});
														}
													}
												}
											}.bind(this),
											error: function (response) {
												if (this.varEstado4 === "V") {
													this.varEstado4 = "E";
													this.funValidarConteoDeRegistros();
													this.getView().setBusy(false);
													this.getView().byId("idListMaster1").removeSelections(true);
													var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
													oProductDetail1PanelCabecera.setVisible(false);
													this.getView().byId("idEliminar").setVisible(false);
													var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
													oProductDetail1PanelIconBar.setVisible(false);
													this.inicioListaFacturas();
												}
											}.bind(this)
										});
									}
								} else {
									//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
									var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + this.varObjeto1.EM_RUC.toString() +
										"',US_RUC='" + this.varObjeto1.US_RUC.toString() +
										"',ID_FACTURA='" + this.varObjeto1.ID_FACTURA.toString() +
										"')";
									this.contPos = 0;
									this.contOC = 0;
									this.contDoc = 0;
									oModelOData.remove(ordenCompra, {
										success: function (response) {
											var dialogA = new sap.m.Dialog({
												title: 'Éxito',
												type: 'Message',
												state: 'Success',
												icon: "sap-icon://accept",
												content: new sap.m.Text({
													text: "Se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' ."
												}),
												beginButton: new sap.m.Button({
													text: 'Aceptar',
													icon: "sap-icon://accept",
													type: "Accept",
													press: function () {
														dialogA.close();
													}.bind(this)
												}),
												afterClose: function () {
													dialogA.destroy();
												}
											});
											dialogA.open();
			
											this.getView().setBusy(false);
											this.getView().byId("idListMaster1").removeSelections(true);
											var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
											oProductDetail1PanelCabecera.setVisible(false);
											this.getView().byId("idEliminar").setVisible(false);
											var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
											oProductDetail1PanelIconBar.setVisible(false);
											this.inicioListaFacturas();
										}.bind(this),
										error: function (response) {
											var dialogA = new sap.m.Dialog({
												title: 'Error',
												type: 'Message',
												state: 'Error',
												icon: "sap-icon://error",
												content: new sap.m.Text({
													text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA +
														"' - ERROR: T_FAC."
												}),
												beginButton: new sap.m.Button({
													text: 'Aceptar',
													icon: "sap-icon://accept",
													type: "Accept",
													press: function () {
														dialogA.close();
													}.bind(this)
												}),
												afterClose: function () {
													dialogA.destroy();
												}
											});
											dialogA.open();
			
											this.getView().byId("idErrores").setVisible(true);
											this.getView().setBusy(false);
											this.getView().byId("idListMaster1").removeSelections(true);
											var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
											oProductDetail1PanelCabecera.setVisible(false);
											this.getView().byId("idEliminar").setVisible(false);
											var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
											oProductDetail1PanelIconBar.setVisible(false);
											this.inicioListaFacturas();
										}.bind(this),
									});
								}
							}
						}					
				}.bind(this),
				error: function (data) {
					console.log("Update A en el t_Fac - error");
				}.bind(this)
			});
				



		},

		funValidarConteoDeRegistros: function () {
			if (this.varEstado0 === "E") {
				var dialogA = new sap.m.Dialog({
					title: 'Error',
					type: 'Message',
					state: 'Error',
					icon: "sap-icon://error",
					content: new sap.m.Text({
						text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' - ERROR al leer REPOSITORIO."
					}),
					beginButton: new sap.m.Button({
						text: 'Aceptar',
						icon: "sap-icon://accept",
						type: "Accept",
						press: function () {
							dialogA.close();
						}.bind(this)
					}),
					afterClose: function () {
						dialogA.destroy();
					}
				});
				dialogA.open();
			}
			if (this.varEstado1 === "E") {
				var dialogA = new sap.m.Dialog({
					title: 'Error',
					type: 'Message',
					state: 'Error',
					icon: "sap-icon://error",
					content: new sap.m.Text({
						text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' - ERROR: T_DOC."
					}),
					beginButton: new sap.m.Button({
						text: 'Aceptar',
						icon: "sap-icon://accept",
						type: "Accept",
						press: function () {
							dialogA.close();
						}.bind(this)
					}),
					afterClose: function () {
						dialogA.destroy();
					}
				});
				dialogA.open();
			}

			if (this.varEstado2 === "E") {
				var dialogA = new sap.m.Dialog({
					title: 'Error',
					type: 'Message',
					state: 'Error',
					icon: "sap-icon://error",
					content: new sap.m.Text({
						text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' - ERROR: Document Service."
					}),
					beginButton: new sap.m.Button({
						text: 'Aceptar',
						icon: "sap-icon://accept",
						type: "Accept",
						press: function () {
							dialogA.close();
						}.bind(this)
					}),
					afterClose: function () {
						dialogA.destroy();
					}
				});
				dialogA.open();
			}

			if (this.varEstado3 === "E") {
				var dialogA = new sap.m.Dialog({
					title: 'Error',
					type: 'Message',
					state: 'Error',
					icon: "sap-icon://error",
					content: new sap.m.Text({
						text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' - ERROR: T_FAC_DET."
					}),
					beginButton: new sap.m.Button({
						text: 'Aceptar',
						icon: "sap-icon://accept",
						type: "Accept",
						press: function () {
							dialogA.close();
						}.bind(this)
					}),
					afterClose: function () {
						dialogA.destroy();
					}
				});
				dialogA.open();
			}

			if (this.varEstado4 === "E") {
				var dialogA = new sap.m.Dialog({
					title: 'Error',
					type: 'Message',
					state: 'Error',
					icon: "sap-icon://error",
					content: new sap.m.Text({
						text: "No se eliminó con éxito la factura '" + this.varObjeto1.ID_FACTURA + "' - ERROR: T_FAC_POS."
					}),
					beginButton: new sap.m.Button({
						text: 'Aceptar',
						icon: "sap-icon://accept",
						type: "Accept",
						press: function () {
							dialogA.close();
						}.bind(this)
					}),
					afterClose: function () {
						dialogA.destroy();
					}
				});
				dialogA.open();
			}
		},

		ressEliminarFactura: function () {

			this.getView().setBusy(true);
			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var oModelmyParam = this.getView().getModel("myParam");
			oModelmyParam.setProperty("/listErrores", []);
			var listItemFacturas = oModelmyParam.getProperty("/listItemFacturas");
			var listDocAdjuntarFac = oModelmyParam.getProperty("/listDocAdjuntarFac");
			var listItemFacturaPosicion = oModelmyParam.getProperty("/listItemFacturaPosicion");
			var objeto = this.getView().byId("ohFac").getBindingContext("myParam").getObject();

			var factura = this.getView().byId("ohFac").getBindingContext("myParam").getObject().ID_FACTURA;
			var data1 = {
				'cmisaction': 'delete'
			};
			var formData = new FormData();
			jQuery.each(data1, function (key, value) {
				formData.append(key, value);
			});

			//var ordenCompra = "/T_FACs(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
			var ordenCompra = "/" + this.varTableT_FAC + "(EM_RUC='" + objeto.EM_RUC.toString() + "',US_RUC='" + objeto.US_RUC.toString() +
				"',ID_FACTURA='" + objeto.ID_FACTURA.toString() +
				"')";
			this.contPos = 0;
			this.contOC = 0;
			this.contDoc = 0;
			oModelJson.remove(ordenCompra, {

				success: function (response) {
					//$.ajax('/DOCUMENT/6d47b482a30ca504bfdf66d5/root/' + factura + ".xml", {
					$.ajax("" + this.varTableDocument + "/" + factura + ".xml", {
						type: 'POST',
						data: formData,
						cache: false,
						processData: false,
						contentType: false,
						success: function (response) {}.bind(this),
						error: function (response) {}.bind(this)
					});

					this.obtenerExitoOdata("Factura " + objeto.ID_FACTURA, "Se eliminó con éxito la factura " + objeto.ID_FACTURA + ".");

					for (var i = 0; i < listItemFacturas.length; i++) {
						//var detOrdenCompra = "/T_FAC_DETs(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
						var detOrdenCompra = "/" + this.varTableT_FAC_DET + "(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
							"',US_RUC='" + listItemFacturas[i].US_RUC.toString() +
							"',ID_FACTURA='" + listItemFacturas[i].ID_FACTURA.toString() +
							"',POS_FACTURA='" + listItemFacturas[i].POS_FACTURA.toString() +
							"')";
						oModelJson.remove(detOrdenCompra, {
							success: function (response) {
								this.obtenerExitoOdata("Factura " + listItemFacturas[this.contPos].ID_FACTURA + ", Posición " + listItemFacturas[this.contPos]
									.POS_FACTURA, "Se eliminó con éxito la posición " + objeto.ID_FACTURA + "-" +
									listItemFacturas[this.contPos].POS_FACTURA + ".");
								this.contPos++;
							}.bind(this),
							error: function (response) {
								this.obtenerErrorOdata(response, "Error al eliminar en T_FAC_DET", "No se pudo eliminar una posición de la factura " +
									objeto.ID_FACTURA + ".");
								this.contPos++;
							}.bind(this)
						});
					}
					for (var j = 0; j < listItemFacturaPosicion.length; j++) {
						//var detOrdenCompra = "/T_FAC_POSs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC +
						var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC +
							"',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
							"',ID_FACTURA='" + listItemFacturaPosicion[j].ID_FACTURA +
							"',POS_FACTURA='" + listItemFacturaPosicion[j].POS_FACTURA +
							"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[j].OC_NUMERO_ORDEN +
							"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[j].DE_DOC_MATERIAL +
							"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[j].DE_HOJA_ENTRADA +
							"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[j].DE_POS_DOC_MATERIAL +
							//"',GUIA_REMISION='" + listItemFacturaPosicion[j].GUIA_REMISION +
							"',DE_POSICION='" + listItemFacturaPosicion[j].DE_POSICION + "')";
						oModelJson.remove(detOrdenCompra, {
							success: function (response) {
								this.obtenerExitoOdata("Factura " + listItemFacturaPosicion[this.contOC].ID_FACTURA + ", Posición " +
									listItemFacturaPosicion[this.contOC].POS_FACTURA + ", OC " + listItemFacturaPosicion[this.contOC].OC_NUMERO_ORDEN +
									", OC Posición " + listItemFacturaPosicion[this.contOC].DE_POSICION, "Se eliminó con éxito la OC " +
									listItemFacturaPosicion[this.contOC].OC_NUMERO_ORDEN +
									"-" + listItemFacturaPosicion[this.contOC].DE_POSICION + ".");
								this.contOC++;
							}.bind(this),
							error: function (response) {
								this.obtenerErrorOdata(response, "Error al eliminar en T_FAC_POS", "No se pudo eliminar una OC de la factura " + objeto.ID_FACTURA +
									".");
								this.contOC++;
							}.bind(this)
						});
						var oThis = this;
						var oModel = oThis.getView().getModel("myParam");
						var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
						if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
							//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
							var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" +
								listItemFacturaPosicion[j].US_RUC +
								"',DE_POSICION='" + listItemFacturaPosicion[j].DE_POSICION +
								//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[j].GUIA_REMISION +
								"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[j].DE_DOC_MATERIAL + "',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[j].OC_NUMERO_ORDEN +
								"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[j].DE_HOJA_ENTRADA + "',DE_POS_DOC_MATERIAL='" +
								listItemFacturaPosicion[j]
								.DE_POS_DOC_MATERIAL + "')";
							var llaveActualizar = {};
							llaveActualizar.DE_FLAC = '';
							oModelJson.update(actOrdenCompra, llaveActualizar, {
								method: "PUT",
								success: function (data) {
								},
								error: function (data) {
								}
							});
						} else if (varTipoCargaDefinir === "N") {
							//var actOrdenConsignacion = "/T_CON_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" +
							var actOrdenConsignacion = "/" + this.varTableT_CON_DET + "(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" +
								listItemFacturaPosicion[j].US_RUC +
								"',WERKS='" + listItemFacturaPosicion[j].VALE_NUM + "',MBLNR='" + listItemFacturaPosicion[j].DE_DOC_MATERIAL + "',MJAHR='" +
								listItemFacturaPosicion[j].VALE +
								"',ZEILE='" + listItemFacturaPosicion[j].DE_POS_DOC_MATERIAL + "')";
							var llaveActualizarC = {};
							llaveActualizarC.FLAC = '';
							oModelJson.update(actOrdenConsignacion, llaveActualizarC, {
								method: "PUT",
								success: function (data) {
								},
								error: function (data) {
								}
							});
						} else if (varTipoCargaDefinir === "C") {
							//var actOrdenConsignacion = "/T_CTR_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" +
							var actOrdenConsignacion = "/" + this.varTableT_CTR_DET + "(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" +
								listItemFacturaPosicion[j].US_RUC +
								"',BELNR='" + listItemFacturaPosicion[j].OC_NUMERO_ORDEN + "',GJAHR='" + listItemFacturaPosicion[j].DE_POSICION + "')";
							var llaveActualizarC = {};
							llaveActualizarC.FLAC = '';
							oModelJson.update(actOrdenConsignacion, llaveActualizarC, {
								method: "PUT",
								success: function (data) {
								},
								error: function (data) {
								}
							});
						}

					}
					for (var d = 0; d < listDocAdjuntarFac.length; d++) {

						//$.ajax('/DOCUMENT/6d47b482a30ca504bfdf66d5/root/' + listDocAdjuntarFac[d].NOMBRE_DOC, {
						$.ajax("" + this.varTableDocument + "/" + listDocAdjuntarFac[d].NOMBRE_DOC, {
							type: 'POST',
							data: formData,
							cache: false,
							processData: false,
							contentType: false,
							success: function (response) {
								this.obtenerExitoOdata("Factura " + listDocAdjuntarFac[this.contDoc].ID_FACTURA + ", Posición documento " +
									listDocAdjuntarFac[this.contDoc].POS_DOCUMENTO, "Se eliminó con éxito el documento " + listDocAdjuntarFac[this.contDoc]
									.NOMBRE_DOC + ".");
								this.contDoc++;
							}.bind(this),
							error: function (response) {
								this.obtenerErrorOdata(response, "Error al eliminar en T_DOC", "No se pudo eliminar una documento de la factura " +
									objeto.ID_FACTURA + ".");
								this.contDoc++;
							}.bind(this)
						});
						//var documento = "/T_DOCs(EM_RUC='" + listDocAdjuntarFac[d].EM_RUC + "',US_RUC='" + listDocAdjuntarFac[d]
						var documento = "/" + this.varTableT_DOC + "(EM_RUC='" + listDocAdjuntarFac[d].EM_RUC + "',US_RUC='" + listDocAdjuntarFac[d]
							.US_RUC +
							"',ID_FACTURA='" + listDocAdjuntarFac[d].ID_FACTURA +
							"',POS_DOCUMENTO='" + listDocAdjuntarFac[d].POS_DOCUMENTO + "')";
						oModelJson.remove(documento, {
							success: function (response) {
							}.bind(this),
							error: function (response) {
							}.bind(this)
						});
					}

					// Desactivar Flac

					this.getView().setBusy(false);
					// var dialog = new sap.m.Dialog({
					// 	title: "Éxito",
					// 	type: "Message",
					// 	state: "Success",
					// 	icon: "sap-icon://expense-report",
					// 	content: new sap.m.Text({
					// 		text: "Se eliminó la factura " + objeto.OC_ID_FACTURA + " y sus componentes correctamente."

					// 	}),
					// 	beginButton: new sap.m.Button({
					// 		text: "Aceptar",
					// 		press: function () {
					// 			this.inicioListaFacturaOrdenesCompraRe();
					// 			dialog.close();
					// 		}.bind(this)
					// 	}),
					// 	afterClose: function () {
					// 		dialog.destroy();
					// 	}
					// });
					// dialog.open();
					this.btnErrores();
					this.getView().byId("idListMaster1").removeSelections(true);
					this.getView().byId("idErrores").setVisible(true);
					var oProductDetail1PanelCabecera = this.getView().byId("ohFac");
					oProductDetail1PanelCabecera.setVisible(false);
					this.getView().byId("idEliminar").setVisible(false);

					var oProductDetail1PanelIconBar = this.getView().byId("idTabBarFac");
					oProductDetail1PanelIconBar.setVisible(false);
					this.inicioListaFacturas();
				}.bind(this),
				error: function (response) {
					this.obtenerErrorOdata(response, "Error al eliminar en T_FAC", "No se pudo registrar la factura " + objeto.ID_FACTURA + ".");
					this.btnErrores();
					this.getView().byId("idErrores").setVisible(true);
					this.getView().setBusy(false);
				}.bind(this),
			});
		},
		dialogAdjuntarDocumento: function () {
			var dialogB = new sap.m.Dialog({
				icon: "sap-icon://database",
				title: "Adjuntar documento",
				type: "Message",
				state: "Success",
				contentWidth: "700px",
				content: [new FileUploader({
					id: "filterId",
					width: "100%",
					sameFilenameAllowed: false,
					placeholder: "Ingrese documento ...",
					style: "Emphasized",
					buttonText: "Navegar",
					icon: "sap-icon://laptop"
				})],
				beginButton: new sap.m.Button({
					text: "Guardar",
					icon: "sap-icon://save",
					type: "Accept",
					press: function () {}
				}),
				endButton: new sap.m.Button({
					text: "Cerrar",
					icon: "sap-icon://decline",
					type: "Reject",
					press: function () {
						dialogB.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialogB.destroy();
				}
			});
			dialogB.open();
		},

		btnDescargarPDF: function () {

			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var varTblItemFacturas = oModel.getProperty("/listConsultaResumenFactura");

			var fullHtml = "";
			var header = this.getHeaderForm(varTblItemFacturas);
			fullHtml += header;

			var configuracion_ventana = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
			var wind = window.open("", "prntExample", configuracion_ventana);
			wind.document.write(fullHtml);
			setTimeout(function () {
				wind.print();
				wind.close();
			}, 1000);
		},

		getHeaderForm: function (modelData) {

			var calculo = parseFloat(modelData.TOTAL_IMP) - parseFloat(modelData.TOTAL_IGV);
			calculo = calculo.toFixed(2);

			return "<hr/><div>" +
				"<H1>Factura              : " + modelData.ID_FACTURA + "</H1>" +
				"<p><H3>" + modelData.NOM_DEM_RAZ_ADQ + "</H3></p>" +
				"<p><H2>" + modelData.NOM_COMERCIAL + "</H2></p>" +
				"<div style=float:left>" +
				"<p><b>RUC Proveedor          : </b>" + modelData.US_RUC + "</p>" +
				"<p><b>Versión UBL            : </b>" + modelData.UBL + "</p>" + //CO_FACTURA
				"<p><b>Estado                 : </b>" + this.formatTipoEStado(modelData.ESTADO) + "</p>" +
				"<p><b>Fecha de pre registro  : </b>" + modelData.FC_FEC_REGISTRO + "</p>" +
				"<p><b>Hora de pre registro   : </b>" + modelData.FC_HORA_REGISTRO + "</p>" +
				"</div><div style=float:right>" +
				"<p><b>RUC Empresa            : </b>" + modelData.EM_RUC + "</p>" +
				"<p><b>Carga                  : </b>" + this.formatTipoCarga(modelData.TIPO_CARGA) + "</p>" +
				"<p><b>Total IGV              : </b>" + modelData.TOTAL_IGV + " " + modelData.MONEDA + "</p>" +
				"<p><b>Total Importe sin IGV  : </b>" + calculo + " " + modelData.MONEDA + "</p>" +
				"<p><b>Total Importe con IGV  : </b>" + modelData.TOTAL_IMP + " " + modelData.MONEDA + "</p>" +
				"</div></div>";
		}
	});
});