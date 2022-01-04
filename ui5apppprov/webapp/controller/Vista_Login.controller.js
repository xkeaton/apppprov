sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Login", {

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

			this.getRouter().getRoute("Vista_Login").attachMatched(this._onRouteMatched, this);
			this.getView().byId("idValidacionUsuario").setVisible(false);
			this.getView().byId("idUsuario").addStyleClass("miVistaInputUsuario");
			this.getView().byId("idPassword").addStyleClass("miVistaInputUsuario");
			this.getView().byId("idTitulo").addStyleClass("miVistaLabelTitulo");

			var that = this;
			var sCaptcha = this.customMethod();
			that.byId("idGenerarcaptcha").setText(sCaptcha);
		},

		onAfterRendering: function () {
			this.getView().byId("idLoginVBox").addStyleClass("miFondoLogin");
			this.getView().byId("idVisualizarPass").addStyleClass("styleVisualizarPass");
			this.getView().byId("idGenerarcaptcha").addStyleClass("styleGeneratecaptcha");
			this.getView().byId("idTextoFooter").addStyleClass("styleTextoFooter");

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


			this.getView().byId("idUsuario").setValue("");
			this.getDataRucEmpresa();
		//	this.funcionRegistrar();
		},

		onBeforeRendering: function () {
			this.getView().byId("idUsuario").setValue("");
		},

		onExit: function () {
			this.getView().byId("idUsuario").setValue("");

			if (this.intervalHandle)
				clearInterval(this.intervalHandle);
		},
		funcionCrearDocumento:function(){
					$.ajax('/DOCUMENT2/0fa18b2408d67cefb014c1e5/root', {
					// $.ajax('/DOCUMENT2/1593db4fc5b0ae1b642cc1e5/root', {
				method: 'GET',
				success: function (response) {
					try{
					for (var i = 0; i < response.objects.length; i++) {

						var nombre = response.objects[i].object.properties["cmis:name"].value;
					 this.funcionRegistrar(nombre);

					}
					}catch(err){
					}
				}.bind(this),
				error: function (err) {
				}.bind(this)
			});
		},
		funcionRegistrar: function (nombre) {
			var request = new XMLHttpRequest();
			request.open('GET', "/DOCUMENT2/0fa18b2408d67cefb014c1e5/root/" + nombre, true);
			request.responseType = 'blob';
			request.onload = function () {
				var reader = new FileReader();
				reader.readAsDataURL(request.response);
				reader.onload = function (e) {

					var file2 = this.dataURLtoFile(e.target.result, nombre);
					var data = {
						'propertyId[0]': 'cmis:objectTypeId',
						'propertyValue[0]': 'cmis:document',
						'propertyId[1]': 'cmis:name',
						'propertyValue[1]': nombre,
						'cmisaction': 'createDocument'
					};

					var formData = new FormData();
					formData.append('datafile', file2);
					jQuery.each(data, function (key, value) {
						formData.append(key, value);
					});
					$.ajax('/DOCUMENTP/56bcebcf44460413b7434406/root', {
						method: 'POST',
						data: formData,
						cache: false,
						processData: false,
						contentType: false,
						success: function (response) {
						}.bind(this),
						error: function (data) {
						}.bind(this)
					});

				}.bind(this);
			}.bind(this);
			request.send();
		},
		dataURLtoFile: function (dataurl, filename) {

			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);

			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}

			return new File([u8arr], filename, {
				type: mime
			});
		},
		registrarServicio:function(){
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
				this.varTableURL = oModel.getProperty("/listTablasOData/clistTablasODataURL");
					this.varTableT_SERVICIOS = oModel.getProperty("/listTablasOData/clistTablasODataT_SERVICIOS");
				var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
							var llave = {};
							llave.SERVICIO = "Validacion_reporte01";
							llave.CAMPO1 = "60";
							llave.CAMPO2 = "";
							llave.CAMPO3 = "";
							llave.ESTADO = "X";
							llave.FLAG1 = "";
							llave.FLAG2 = "";
							llave.FLAG3 = "";
							//oModel.create("/T_CENs", llave, {
							oModel.create("/" + this.varTableT_SERVICIOS + "", llave, {
								method: "POST",
								success: function (data) {
									console.log(data);
								}.bind(this),
								error: function (data) {
									console.log(data);
								}.bind(this)
							});
		},
		_onRouteMatched: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			this.onRefresh();
			this.getView().byId("idTextoCaptcha").setValue("");

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

			this.getView().byId("idUsuario").setValue("");
			this.getDataRucEmpresa();
		},

		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		btnVisualizarCon: function () {

			var varTipoInput = this.getView().byId('idPassword').getType();
			if (varTipoInput === "Password") {
				this.getView().byId('idPassword').setType("Text");
			} else {
				this.getView().byId('idPassword').setType("Password");
			}
		},

		btnIngresar: function () {
			var canContinue = true;
			var inputs = [
				this.getView().byId("idUsuario"),
				this.getView().byId("idPassword"),
				this.getView().byId("idTextoCaptcha")
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
				// Llamar modelo
				var oThis = this;
				var oModel = oThis.getView().getModel("myParam");

				var Input1 = this.byId("idGenerarcaptcha").getText();
				var Input2 = this.byId("idTextoCaptcha").getValue();

				if (Input1 === Input2) {
					//Filtros
					var filters = [];
					var filter;

					//var url = "/odatabnv/odata2.svc/";
					var url = "" + this.varTableURL + "/";
					var oModelxd = new sap.ui.model.odata.v2.ODataModel(url, true);

					var varUsuario = this.getView().byId("idUsuario").getValue();
					filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.EQ, varUsuario);
					filters.push(filter);
					var varPassword = this.getView().byId("idPassword").getValue();
					var varPasswordEncriptado = this.funEncriptar(varPassword).substring(0, 29).toString();
					filter = new sap.ui.model.Filter("US_CONTRASENA", sap.ui.model.FilterOperator.EQ, varPasswordEncriptado);
					filters.push(filter);
					filter = new sap.ui.model.Filter("ESTADO", sap.ui.model.FilterOperator.EQ, "a");
					filters.push(filter);

					// Mostrar JSON
					//oModelxd.read("/T_USERs?$format=json", {
					oModelxd.read("/" + this.varTableT_USER + "?$format=json", {
						filters: filters,
						success: function (response) {
							oModel.setProperty("/usuarioLogin", varUsuario);
							oModel.setProperty("/usuarioLoginAlternativo", varUsuario);
							var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

							var lenghtV = oModelJSON.getData().length;
							if (lenghtV !== 0) {
								oModel.setProperty("/tipoDeUsuario", oModelJSON.getData()[0].AUTORIZACION);
								oModel.setProperty("/usuarioReal", varUsuario);
								var varEstado = oModelJSON.getData()[0].TOLERANCIA;

								if (varEstado === "yes") {
									var dialogA = new sap.m.Dialog({
										title: "Actualizar contraseña",
										icon: "sap-icon://edit",
										type: "Message",
										state: "Success",
										contentWidth: "600px",
										content: [
											new sap.m.Toolbar({
												height: "auto",
												width: "100%",
												content: [new sap.m.Label({
														text: "Contraseña de Email : ",
														textAlign: "Right",
														width: "30%"
													}),
													new sap.m.Input({
														id: "idPass0",
														placeholder: "Ingrese Contraseña de Email (50) ...",
														maxLength: 50,
														width: "60%",
														type: "Password",
														editable: true
													}),
													new sap.m.ToggleButton({
														icon: "sap-icon://show",
														press: function (oEvent) {
															var varTipoInput = sap.ui.getCore().byId('idPass0').getType();
															if (varTipoInput === "Password") {
																sap.ui.getCore().byId('idPass0').setType("Text");
															} else {
																sap.ui.getCore().byId('idPass0').setType("Password");
															}
														},
														width: "10%"
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
														text: "Nueva contraseña : ",
														textAlign: "Right",
														width: "30%"
													}),
													new sap.m.Input({
														id: "idPass1",
														placeholder: "Ingrese nueva contraseña (50) ...",
														maxLength: 50,
														width: "60%",
														type: "Password",
														editable: true
													}),
													new sap.m.ToggleButton({
														icon: "sap-icon://show",
														press: function (oEvent) {
															var varTipoInput = sap.ui.getCore().byId('idPass1').getType();
															if (varTipoInput === "Password") {
																sap.ui.getCore().byId('idPass1').setType("Text");
															} else {
																sap.ui.getCore().byId('idPass1').setType("Password");
															}
														},
														width: "10%"
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
														text: "Repita contraseña : ",
														textAlign: "Right",
														width: "30%"
													}),
													new sap.m.Input({
														id: "idPass2",
														placeholder: "Ingrese de nuevo la contraseña (50) ...",
														maxLength: 50,
														width: "60%",
														type: "Password",
														editable: true
													}),
													new sap.m.ToggleButton({
														icon: "sap-icon://show",
														press: function (oEvent) {
															var varTipoInput = sap.ui.getCore().byId('idPass2').getType();
															if (varTipoInput === "Password") {
																sap.ui.getCore().byId('idPass2').setType("Text");
															} else {
																sap.ui.getCore().byId('idPass2').setType("Password");
															}
														},
														width: "10%"
													})
												]
											})
										],
										beginButton: new sap.m.Button({
											text: "Actualizar",
											icon: "sap-icon://accept",
											press: function () {
												var inputs = [
													sap.ui.getCore().byId("idPass0"),
													sap.ui.getCore().byId("idPass1"),
													sap.ui.getCore().byId("idPass2")
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
													///////////////////////////////////////
													var varUsuario = oModelJSON.getData()[0].US_USUARIO;
													var varPassAnt = sap.ui.getCore().byId("idPass0").getValue();
													var varPassAne = oThis.funEncriptar(varPassAnt).substring(0, 29).toString();
													var varPassNew = sap.ui.getCore().byId("idPass1").getValue();
													var varPassRep = sap.ui.getCore().byId("idPass2").getValue();
													var varPassbds = oModelJSON.getData()[0].US_CONTRASENA;
													var varPassest = "not";

													if (varPassAne === varPassbds) {
														if (varPassNew === varPassRep) {

															////////////////////////////////////////////////////
															var llaveActualizar = {};
															llaveActualizar.US_CONTRASENA = oThis.funEncriptar(varPassNew).substring(0, 29).toString();
															llaveActualizar.TOLERANCIA = varPassest.toString();
															//var texto = "/T_USERs(US_USUARIO='" + varUsuario + "')";
															var texto = "/" + this.varTableT_USER + "(US_USUARIO='" + varUsuario + "')";
															oModelxd.update(texto, llaveActualizar, {
																method: "PUT",
																success: function (data) {
																	var dialogC = new sap.m.Dialog({
																		title: "Mensaje",
																		type: "Message",
																		state: "Success",
																		content: new sap.m.Text({
																			text: "La contraseña se actualizó correctamente."
																		}),
																		beginButton: new sap.m.Button({
																			text: "OK",
																			type: "Accept",
																			press: function () {
																				dialogC.close();
																			}
																		}),
																		afterClose: function (response) {
																			dialogC.destroy();
																		}.bind(this)
																	});
																	dialogC.open();
																	dialogA.close();
																},
																error: function (data) {
																}
															});
															////////////////////////////////////////////////////
														} else {
															var dialog = new sap.m.Dialog({
																title: "Alerta",
																type: "Message",
																state: "Warning",
																content: new sap.m.Text({
																	text: "La contraseñas nuevas no coinciden."

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

													} else {
														var dialog = new sap.m.Dialog({
															title: "Alerta",
															type: "Message",
															state: "Warning",
															content: new sap.m.Text({
																text: "La contraseña del correo no coincide."

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

													///////////////////////////////////////
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
												dialogA.close();
											}.bind(this)
										}),
										afterClose: function (response) {
											dialogA.destroy();
										}.bind(this)
									});
									dialogA.open();
								} else {
									this.getRouter().navTo("Vista_Menu_Principal");
									this.getView().byId("idValidacionUsuario").setVisible(false);
								}
							} else {
								this.getView().byId("idValidacionUsuario").setVisible(true);
								this.onRefresh();
								this.getView().byId("idTextoCaptcha").setValue("");
							}
							//p123456789
							// this.getRouter().navTo("Vista_Menu_Principal");
							// this.getView().byId("idValidacionUsuario").setVisible(false);
							this.getView().setBusy(false);
						}.bind(this),
						error: function (oError) {
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
					//this.getDataRucEmpresa();
				} else {
					this.getView().setBusy(false);
					var dialogA = new sap.m.Dialog({
						title: "Mensaje de Alerta",
						type: "Message",
						state: "Warning",
						content: new sap.m.Text({
							text: "El captcha es incorrecto."
						}),
						beginButton: new sap.m.Button({
							text: "OK",
							type: "Accept",
							press: function () {
								this.onRefresh();
								this.getView().byId("idTextoCaptcha").setValue("");
								dialogA.close();
							}.bind(this)
						}),
						afterClose: function (response) {
							dialogA.destroy();
						}.bind(this)
					});
					dialogA.open();
				}
			} else {
				var dialogMensaje = new sap.m.Dialog({
					draggable: true,
					resizable: true,
					contentWidth: "370px",
					title: "Mensaje de alerta",
					content: [
						new sap.m.Label({
							text: "Se requiere ingresar/seleccionar todos los campos.",
							wrapping: true,
							width: "100%"
						})
					],
					state: "Warning",
					type: "Message",
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
			}
		},

		getDataRucEmpresa: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			//oModelJson.read("/T_CENs?$format=json", {
			oModelJson.read("/" + this.varTableT_CEN + "?$format=json", {
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var tamTabla = oModelJSON.getData().length;
					var vector = [];
					var llave = {};
					for (var i = 0; i < tamTabla; i++) {
						llave = {};
						llave.descripcion = oModelJSON.getData()[i].DES_EM;
						llave.codigo = oModelJSON.getData()[i].RUC_EM;
						vector.push(llave);
					}
					oModel.setProperty("/usuarioRuc", oModelJSON.getData()[0].RUC_EM);
					oModel.setProperty("/listaEmpresasRUC", vector);
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listaEmpresasRUC", []);
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

		startTime: function () {
			this.seconds++;
			this.time = setTimeout("startTime()", 1000);
			if (this.seconds >= 10) {
				this.on = false;
				clearTimeout(this.time);
			}
		},

		contarClick: function () {
			this.onExit();
			this.modelServices();
		},

		modelServices: function () {

			var varSegundos = 0;
			var varCont = 0;
			var oModeldata = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModeldata, "datalake");
			this.intervalHandle = setInterval(function () {
				varSegundos++;
				if (varSegundos > 10) {
					varCont++;
				}

				if (varCont !== 0) {
					this.onExit();
				}

			}.bind(this), 1000);
		},

		btnGenRecPassword: function () {

			this.getView().byId("idValidacionUsuario").setVisible(false);

			var dialog2 = new sap.m.Dialog({
				title: 'Solicitar contraseña',
				icon: "sap-icon://key",
				type: 'Message',
				state: "Success",
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
								liveChange: function (evt) {
									sap.ui.getCore().byId("idCor").setBusy(true);
									var varUsuario = sap.ui.getCore().byId("idRuc").getValue();
									var filters = [];
									var filter;
									filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.EQ, varUsuario);
									filters.push(filter);
									//var url = "/odatabnv/odata2.svc/";
									var url = "" + this.varTableURL + "/";
									var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
									//oModel.read("/T_USERs?$format=json", {
									oModel.read("/" + this.varTableT_USER + "?$format=json", {
										filters: filters,
										success: function (response) {

											var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
											var tamTabla = oModelJSON.getData().length;

											if (tamTabla !== 0) {
												var varbdCorreo = oModelJSON.getData()[0].EMAIL;
												sap.ui.getCore().byId("idCor").setValue(varbdCorreo);
												sap.ui.getCore().byId("idCor").setValueState(sap.ui.core.ValueState.Success);
												sap.ui.getCore().byId("idEnviarContrasena").setEnabled(true);
											} else {
												sap.ui.getCore().byId("idCor").setValue("No se encontró el correo respectivo");
												sap.ui.getCore().byId("idCor").setValueState(sap.ui.core.ValueState.Error);
												sap.ui.getCore().byId("idEnviarContrasena").setEnabled(false);
											}

											sap.ui.getCore().byId("idCor").setBusy(false);
										}.bind(this),
										error: function (oError) {
											sap.ui.getCore().byId("idCor").setBusy(false);
										}.bind(this)
									});
								}.bind(this),
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
								text: "Correo electrónico : ",
								textAlign: "Right",
								width: "30%"
							}),
							new sap.m.Input({
								id: "idCor",
								placeholder: "Ingrese correo electrónico (50) ...",
								maxLength: 50,
								width: "70%",
								editable: false
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					id: "idEnviarContrasena",
					text: 'Enviar contraseña',
					icon: "sap-icon://accept",
					press: function () {
						var canContinue = true;
						var inputs = [
							sap.ui.getCore().byId("idRuc"),
							sap.ui.getCore().byId("idCor")
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

							//var url = "/odatabnv/odata2.svc/";
							var url = "" + this.varTableURL + "/";
							var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);

							var varUsuarioG = sap.ui.getCore().byId("idRuc").getValue();
							var filtersG = [];
							var filterG;
							filterG = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.EQ, varUsuarioG);
							filtersG.push(filterG);
							filterG = new sap.ui.model.Filter("ESTADOG", sap.ui.model.FilterOperator.EQ, "O");
							filtersG.push(filterG);

							//oModel.read("/T_USERs?$format=json", {
							oModel.read("/" + this.varTableT_USER + "?$format=json", {
								filters: filtersG,
								success: function (responseG) {

									var oModelJSONG = new sap.ui.model.json.JSONModel(responseG.results);
									var tamTablaG = oModelJSONG.getData().length;

									if (tamTablaG !== 0) {

										//////////////////////////////////////////////////////////////////
										var varUsuario = sap.ui.getCore().byId("idRuc").getValue();
										var filters = [];
										var filter;
										filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.EQ, varUsuario);
										filters.push(filter);
										filter = new sap.ui.model.Filter("TOLERANCIA", sap.ui.model.FilterOperator.NE, "yes");
										filters.push(filter);
										oModel.read("/" + this.varTableT_USER + "?$format=json", {
											filters: filters,
											success: function (response) {

												var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
												var tamTabla = oModelJSON.getData().length;

												if (tamTabla !== 0) {
													var varbdRUC = oModelJSON.getData()[0].US_USUARIO;
													var varbdCorreo = oModelJSON.getData()[0].EMAIL;
													var varContrasena = this.funcionCrearPassword();
													// Encriptar
													var varEncriptado = this.funEncriptar(varContrasena);
													var varEstado = "yes";
													var varEstado2 = "G";


													////////////////////////////////////////////////////
													var llaveActualizar = {};
													llaveActualizar.US_CONTRASENA = varEncriptado.substring(0, 29).toString();
													llaveActualizar.TOLERANCIA = varEstado.toString();
													llaveActualizar.US_CONTRASENA2 = varContrasena.toString();
													llaveActualizar.ESTADOG = varEstado2.toString();
													//var texto = "/T_USERs(US_USUARIO='" + varbdRUC + "')";
													var texto = "/" + this.varTableT_USER + "(US_USUARIO='" + varbdRUC + "')";
													oModel.update(texto, llaveActualizar, {
														method: "PUT",
														success: function (data) {
															var dialogA = new sap.m.Dialog({
																title: "Mensaje",
																type: "Message",
																state: "Success",
																content: new sap.m.Text({
																	text: "La contraseña será enviada a su correo electrónico, por favor espere unos minutos."
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
														},
														error: function (data) {
														}
													});
													////////////////////////////////////////////////////

												} else {
													var dialogA = new sap.m.Dialog({
														title: "Mensaje de confirmación",
														type: "Message",
														state: "Warning",
														content: new sap.m.Text({
															text: "La contraseña ya fue enviada a su correo, por favor espere unos minutos."
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
												}

												dialog2.close();
											}.bind(this),
											error: function (oError) {}.bind(this)
										});
										//////////////////////////////////////////////////////////////////

									} else {
										var dialogA = new sap.m.Dialog({
											title: "Mensaje de espera",
											type: "Message",
											state: "Warning",
											content: new sap.m.Text({
												text: "La contraseña ya fue enviada a su correo, por favor espere unos minutos."
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
									}

									dialog2.close();
								}.bind(this),
								error: function (oError) {}.bind(this)
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

		funcionCrearPassword: function () {

			//var chars = "!()*+,-./:;<=>?@[\]_{|}~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			var string_length = 12;
			var randomstring = '';
			for (var i = 0; i < string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum, rnum + 1);
			}

			return randomstring.toString();
		},

		funEncriptar: function (str) {

			//  discuss at: http://phpjs.org/functions/sha1/
			// original by: Webtoolkit.info (http://www.webtoolkit.info/)
			// improved by: Michael White (http://getsprink.com)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			//    input by: Brett Zamir (http://brett-zamir.me)
			//  depends on: utf8_encode
			//   example 1: sha1('Kevin van Zonneveld');
			//   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

			var rotate_left = function (n, s) {
				var t4 = (n << s) | (n >>> (32 - s));
				return t4;
			};

			var cvt_hex = function (val) {
				var str = '';
				var i;
				var v;

				for (i = 7; i >= 0; i--) {
					v = (val >>> (i * 4)) & 0x0f;
					str += v.toString(16);
				}
				return str;
			};

			var blockstart;
			var i, j;
			var W = new Array(80);
			var H0 = 0x67452301;
			var H1 = 0xEFCDAB89;
			var H2 = 0x98BADCFE;
			var H3 = 0x10325476;
			var H4 = 0xC3D2E1F0;
			var A, B, C, D, E;
			var temp;

			str = this.utf8_encode(str);
			var str_len = str.length;

			var word_array = [];
			for (i = 0; i < str_len - 3; i += 4) {
				j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
				word_array.push(j);
			}

			switch (str_len % 4) {
			case 0:
				i = 0x080000000;
				break;
			case 1:
				i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
				break;
			case 2:
				i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
				break;
			case 3:
				i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
					8 | 0x80;
				break;
			}

			word_array.push(i);

			while ((word_array.length % 16) != 14) {
				word_array.push(0);
			}

			word_array.push(str_len >>> 29);
			word_array.push((str_len << 3) & 0x0ffffffff);

			for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
				for (i = 0; i < 16; i++) {
					W[i] = word_array[blockstart + i];
				}
				for (i = 16; i <= 79; i++) {
					W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
				}

				A = H0;
				B = H1;
				C = H2;
				D = H3;
				E = H4;

				for (i = 0; i <= 19; i++) {
					temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
					E = D;
					D = C;
					C = rotate_left(B, 30);
					B = A;
					A = temp;
				}

				for (i = 20; i <= 39; i++) {
					temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
					E = D;
					D = C;
					C = rotate_left(B, 30);
					B = A;
					A = temp;
				}

				for (i = 40; i <= 59; i++) {
					temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
					E = D;
					D = C;
					C = rotate_left(B, 30);
					B = A;
					A = temp;
				}

				for (i = 60; i <= 79; i++) {
					temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
					E = D;
					D = C;
					C = rotate_left(B, 30);
					B = A;
					A = temp;
				}

				H0 = (H0 + A) & 0x0ffffffff;
				H1 = (H1 + B) & 0x0ffffffff;
				H2 = (H2 + C) & 0x0ffffffff;
				H3 = (H3 + D) & 0x0ffffffff;
				H4 = (H4 + E) & 0x0ffffffff;
			}

			temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
			return temp.toLowerCase();
		},

		utf8_encode: function (argString) {

			if (argString === null || typeof argString === 'undefined') {
				return '';
			}

			// .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
			var string = (argString + '');
			var utftext = '';
			var start;
			var end;
			var stringl = 0;

			start = end = 0;
			stringl = string.length;
			for (var n = 0; n < stringl; n++) {
				var c1 = string.charCodeAt(n);
				var enc = null;

				if (c1 < 128) {
					end++;
				} else if (c1 > 127 && c1 < 2048) {
					enc = String.fromCharCode(
						(c1 >> 6) | 192, (c1 & 63) | 128
					);
				} else if ((c1 & 0xF800) !== 0xD800) {
					enc = String.fromCharCode(
						(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
					);
				} else {
					// surrogate pairs
					if ((c1 & 0xFC00) !== 0xD800) {
						throw new RangeError('Unmatched trail surrogate at ' + n);
					}
					var c2 = string.charCodeAt(++n);
					if ((c2 & 0xFC00) !== 0xDC00) {
						throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
					}
					c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
					enc = String.fromCharCode(
						(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
					);
				}
				if (enc !== null) {
					if (end > start) {
						utftext += string.slice(start, end);
					}
					utftext += enc;
					start = end = n + 1;
				}
			}

			if (end > start) {
				utftext += string.slice(start, stringl);
			}

			return utftext;
		},

		chnCambio: function () {

			this.getView().byId("idValidacionUsuario").setVisible(false);
		},

		customMethod: function () {

			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			var string_length = 4;
			var randomstring = '';
			for (var i = 0; i < string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum, rnum + 1);
			}

			return randomstring.toString();
		},

		onRefresh: function () {

			var that = this;
			var sCaptcha = this.customMethod();
			that.byId("idGenerarcaptcha").setText(sCaptcha);
		}
	});
});