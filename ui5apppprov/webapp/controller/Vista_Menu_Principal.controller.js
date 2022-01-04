sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Menu_Principal", {

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

			this.getView().addStyleClass("sapUiSizeCompact");
			this.getRouter().getRoute("Vista_Menu_Principal").attachMatched(this._onRouteMatched, this);

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
		},

		LogOffPress: function () {

			//sap.m.URLHelper.redirect("logout.html", false);
			this.getRouter().navTo("Vista_Login");
		},

		_onRouteMatched: function () {
			console.log("_onRouteMatcheD");
			var oModel = this.getView().getModel("myParam");
			this.oBDURl = oModel.getProperty("/listurlBD/bdClientes")

			/*var today = new Date();
			var dd = today.getDate();
			var MM = today.getMonth() + 1;
			var yyyy = today.getFullYear();

			this.byId("idFecha1").setFooter(yyyy + "/" + MM + "/" + dd);
			this.byId("idFecha2").setFooter(yyyy + "/" + MM + "/" + dd);

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
            debugger;
			this.getItemVisibles();

			this.getView().byId("idItem1").setVisible(false);
			this.getView().byId("idItem2").setVisible(false);
			this.getView().byId("idItem3").setVisible(false);
			this.getView().byId("idItem4").setVisible(false);
			this.getView().byId("idItem5").setVisible(false);
			this.getView().byId("idItem6").setVisible(false);
			this.getView().byId("idItem7").setVisible(false);
			this.getView().byId("idItem8").setVisible(false);
			this.getView().byId("idItem9").setVisible(false);

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

			// Ubicar el proveedor correcto solo validos para usuarios ESTAN
			try {
				var varTamCodigoRucProv = oModel.getProperty("/listaProveedoresRUC");
				var varTamCodigoRucProvLogin = oModel.getProperty("/usuarioLogin");
				var varTamCodigoRucProvLoginAlter = oModel.getProperty("/usuarioLoginAlternativo");
			
				var varopcValidarExisteRUC = "N";
				for (var z = 0; z < varTamCodigoRucProv.length; z++) {
					var varCodiProveedor = oModel.getProperty("/listaProveedoresRUC/" + z + "/codigo");
					var varAdminiProveedor = oModel.getProperty("/listaProveedoresRUC/" + z + "/descripcion");
					var varAdminiTipo = oModel.getProperty("/listaProveedoresRUC/" + z + "/tipo");
					if (varTamCodigoRucProvLoginAlter === varCodiProveedor && varAdminiTipo === "ADMIN") {
						varopcValidarExisteRUC = "S";
					}else if (varTamCodigoRucProvLoginAlter === varCodiProveedor && varAdminiTipo === "AVANZ") {
						varopcValidarExisteRUC = "S";
					}
				}
				if (varopcValidarExisteRUC === "S") {

					for (var k = 0; k < varTamCodigoRucProv.length; k++) {
						if (parseInt(oModel.getProperty("/listaProveedoresRUC/" + k + "/codigo"), 10) === parseInt(varTamCodigoRucProvLogin, 10)) {
							var comboDetra = this.getView().byId("idRUCProveedor");
							comboDetra.getBinding("items").refresh(true);
							var firstItem = comboDetra.getItems()[k];
							comboDetra.setSelectedItem(firstItem, true);
							var valor1 = oModel.getProperty("/listaProveedoresRUC/" + k + "/descripcion");
							var valor2 = oModel.getProperty("/listaProveedoresRUC/" + k + "/codigo");
							oModel.setProperty("/usuarioLoginDescripcionRuc", valor1);
							var productInput = this.getView().byId("productInput");
							productInput.setValue(valor2 + " - " + valor1);
						}
					}

					this.getView().byId("idRUCProveedor").setEditable(false);
					this.getView().byId("idRUCProveedor").setVisible(false);
					this.getView().byId("productInput").setVisible(true);
					this.getView().byId("idRUCProveedorNoAdmin1").setVisible(false);
					this.getView().byId("idRUCProveedorNoAdmin2").setVisible(false);
				} else {
					this.getView().byId("idRUCProveedor").setEditable(false);
					this.getView().byId("idRUCProveedor").setVisible(false);
					this.getView().byId("productInput").setVisible(false);
					this.getView().byId("idRUCProveedorNoAdmin1").setVisible(true);
					this.getView().byId("idRUCProveedorNoAdmin2").setVisible(true);
				}
			} catch (error) {
			}*/
		},
		metObtenerUsuarioPrincipal: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");

			var token = {
				"csrfToken": ""
			};

			var oToken = new sap.ui.model.json.JSONModel(token);
			sap.ui.getCore().setModel(oToken, 'oToken');
			var tokenModel = sap.ui.getCore().getModel("oToken").getData();

			console.log("Token2", tokenModel);

			$.ajax({
				type: "GET",
				// async: false,
				url: "cpdb/mydb/obtUser",
				headers: {
					ContentType: 'application/json',
					Accept: 'application/json',
					cache: false,
					'X-CSRF-Token': 'Fetch'
				},
				success: function (data, textStatus, request) {
					console.log(data.value);
					oModel.setProperty("/listTblOdataUsuarioPrincipal", data.value);

					console.log(oModel.getProperty("/listTblOdataUsuarioPrincipal"));
					//var oListTblOdataUsuarioPrincipal = oModel.getProperty("/listTblOdataUsuarioPrincipal/0/Resp/id");
					var oListTblOdataUsuarioPrincipal = oModel.getProperty("/listTblOdataUsuarioPrincipal/0/nombreCompleto");
					console.log("oListTblOdataUsuarioPrincipal");
					console.log(oListTblOdataUsuarioPrincipal);
					//this.getView().byId("idUserPrincipal").setText(oListTblOdataUsuarioPrincipal);
					//this.onUsuarioSelect2(oListTblOdataUsuarioPrincipal);

					this.oGlobalCodUsusarioPrincipal = oListTblOdataUsuarioPrincipal;
					var varUsuario = this.oGlobalCodUsusarioPrincipal;
					oModel.setProperty("/varUsuarioPrincipalPalicativo", this.oGlobalCodUsusarioPrincipal);
					//oModelxd.read("/" + this.varTableT_USER + "?$format=json", {
					$.ajax({	
						type: "GET",
						url: this.oBDURl + "T_USER?$filter=US_USUARIO eq '" + varUsuario + "'",					
						success: function (response) {
							oModel.setProperty("/redireccion", false);
							oModel.setProperty("/usuarioLogin", varUsuario);
							sap.m.MessageToast.show("Se actualizó el RUC del proveedor : " + varUsuario);
							oModel.setProperty("/usuarioLoginAlternativo", varUsuario);
							var oDataHana = response.value;
							console.log(oDataHana);	
							//if (oDataHana.length !== 0) {							
							//var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
							//var oModelJSON2 = oModelJSON;
							//var lenghtV = oModelJSON.getData().length;
							var lenghtV = oDataHana.length;
							if (lenghtV !== 0) {
								// var varEstado = "no";
								console.log(oDataHana);
								oModel.setProperty("/usuarioLoginDescripcionRuc", oDataHana[0].NOM_USUARIO);
								$.ajax({	
									type: "GET",
									url: this.oBDURl + "T_USER",								
									//oModelxd.read("/" + this.varTableT_USER + "?$format=json", {
									success: function (response) {
										var oDataHana = response.value;
										//var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
										var tamTabla = oDataHana.length;
										var vector = [];
										var llave = {};
										for (var i = 0; i < tamTabla; i++) {
											llave = {};
											llave.descripcion = oDataHana[i].NOM_USUARIO;
											llave.codigo = oDataHana[i].US_USUARIO;
											llave.tipo = oDataHana[i].AUTORIZACION;
											llave.email = oDataHana[i].EMAIL;
											vector.push(llave);
										}
										var model = this.getView().getModel();
										console.log("sin limite");
										//model.setSizeLimit(500);
										oModel.setProperty("/listaProveedoresRUC", vector);
	
										var varEstado = oDataHana[0].TOLERANCIA;
									
										// FEC_EXP
	
										// fechaActual.setDate(fechaActual.getDate() + 2);
	
										// this.getRouter().navTo("Vista_Menu_Principal");
										// this.getView().byId("idValidacionUsuario").setVisible(false);
										var realizarAdmin = oModel.getProperty("/redireccion");
	
										var today = new Date();
										var dd = today.getDate();
										var MM = today.getMonth() + 1;
										var yyyy = today.getFullYear();
	
										this.byId("idFecha1").setFooter(yyyy + "/" + MM + "/" + dd);
										this.byId("idFecha2").setFooter(yyyy + "/" + MM + "/" + dd);
	
										var oView = this.getView();
										oView.setModel(oModel);
										this.getItemVisibles();
	
										//this.getView().byId("idItem1").setVisible(false);
										this.getView().byId("idItem2").setVisible(false);
										this.getView().byId("idItem6").setVisible(false);
										this.getView().byId("idItem7").setVisible(false);
										this.getView().byId("idItem9").setVisible(false);
	
										// Tablas
	
										// Ubicar el proveedor correcto solo validos para usuarios ESTAN
										try {
											var varTamCodigoRucProv = oModel.getProperty("/listaProveedoresRUC");
											var varTamCodigoRucProvLogin = oModel.getProperty("/usuarioLogin");
											var varTamCodigoRucProvLoginAlter = oModel.getProperty("/usuarioLoginAlternativo");
	
											var varopcValidarExisteRUC = "N";
											for (var z = 0; z < varTamCodigoRucProv.length; z++) {
												var varCodiProveedor = oModel.getProperty("/listaProveedoresRUC/" + z + "/codigo");
												var varAdminiProveedor = oModel.getProperty("/listaProveedoresRUC/" + z + "/descripcion");
												var varAdminiTipo = oModel.getProperty("/listaProveedoresRUC/" + z + "/tipo");
												if (varTamCodigoRucProvLoginAlter === varCodiProveedor && varAdminiTipo === "ADMIN") {
													varopcValidarExisteRUC = "S";
												}
											}
	
											//if (varTamCodigoRucProvLoginAlter === "99999999999" || varTamCodigoRucProvLoginAlter === "88888888888") {
											if (varopcValidarExisteRUC === "S") {
	
												for (var k = 0; k < varTamCodigoRucProv.length; k++) {
													if (oModel.getProperty("/listaProveedoresRUC/" + k + "/codigo") === 
															varTamCodigoRucProvLogin) {
																	var realizoMenu = oModel.getProperty("/realizoMenu");
																	if(realizoMenu){
														var comboDetra = this.getView().byId("idRUCProveedor");
														comboDetra.getBinding("items").refresh(true);
														var firstItem = comboDetra.getItems()[k];
														comboDetra.setSelectedItem(firstItem, true);
	
														var valor1 = oModel.getProperty("/listaProveedoresRUC/" + k + "/descripcion");
														var valor2 = oModel.getProperty("/listaProveedoresRUC/" + k + "/codigo");
	
														oModel.setProperty("/usuarioLoginDescripcionRuc", valor1);
														oModel.setProperty("/usuarioLoginDescripcionRuc2", valor2 + " - " + valor1);
														var productInput = this.getView().byId("productInput");
														productInput.setValue(valor2 + " - " + valor1);
															oModel.setProperty("/realizoMenu",false);
																	}else{
																var login = oModel.getProperty("/usuarioLoginDescripcionRuc2");
																var productInput = this.getView().byId("productInput");
														productInput.setValue(login);
														}
													}
												}
	
												this.getView().byId("idRUCProveedor").setEditable(false);
												this.getView().byId("idRUCProveedor").setVisible(false);
												this.getView().byId("productInput").setVisible(true);
												this.getView().byId("idRUCProveedorNoAdmin1").setVisible(false);
												this.getView().byId("idRUCProveedorNoAdmin2").setVisible(false);
											} else {
												this.getView().byId("idRUCProveedor").setEditable(false);
												this.getView().byId("idRUCProveedor").setVisible(false);
												this.getView().byId("productInput").setVisible(false);
												this.getView().byId("idRUCProveedorNoAdmin1").setVisible(true);
												console.log("AQUI AQUI");
												this.getView().byId("idRUCProveedorNoAdmin2").setVisible(true);
											}
	
										} catch (error) {
											console.log(error);
										}
										this.getDataRucEmpresa();
										console.log("error");
									}.bind(this),
									error: function (oError) {
										oModel.setProperty("/listaProveedoresRUC", []);
										// Mensaje de Alerta de que termino el tiempo de sesión					
									}.bind(this)
								});
	
							} else {
								var dialogMensajeSesion = new sap.m.Dialog({
									draggable: true,
									resizable: true,
									contentWidth: "auto",
									title: "Mensaje de alerta",
									content: [
										new sap.m.Label({
											text: "El usuario con el que accedió no es válido para esta aplicación.",
											wrapping: true,
											width: "100%"
										})
									],
									state: "Warning",
									type: "Message",
									endButton: new sap.m.Button({
										press: function () {
                                            this.getView().setBusy(true);
											sap.m.URLHelper.redirect("logout.html", false);
											dialogMensajeSesion.close();
										}.bind(this),
										text: "Aceptar"
									}),
									afterClose: function () {
										dialogMensajeSesion.destroy();
									},
									verticalScrolling: false
								});
								dialogMensajeSesion.open();
							}
							//P123456789
							// oModel.setProperty("/redireccion", false);
							// this.getRouter().navTo("Vista_Menu_Principal");
							// this.getView().byId("idValidacionUsuario").setVisible(false);
							console.log("error2");
							this.getView().setBusy(false);
						}.bind(this),
						error: function (oError) {
							this.getView().setBusy(false);
							// Mensaje de Alerta de que termino el tiempo de sesión
				
						}.bind(this)
					});
					console.log("error3");
					tokenModel["csrfToken"] = request.getResponseHeader('X-CSRF-Token');
					this.token = tokenModel["csrfToken"];

					oModel.setProperty("/varUsuarioPrincipalTokken", tokenModel["csrfToken"]);
				
				}.bind(this),
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log("Status: " + textStatus);
					console.log("Error: " + errorThrown);			

				}.bind(this)
			});
		},        
		getDataRucEmpresa: function () {
			console.log("getDataRucEmpresa");
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			//oModelJson.read("/T_CENs?$format=json", {
				
			//oModelJson.read("/" + this.varTableT_CEN + "?$format=json", {
			$.ajax({	
				type: "GET",
				url: this.oBDURl + "T_SOCIEDADES",					
				success: function (response) {
					//var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var oDataHana = response.value;
					console.log(oDataHana);
				
					var tamTabla = oDataHana.length;
					var vector = [];
					var llave = {};
					for (var i = 0; i < tamTabla; i++) {
						llave = {};
						llave.descripcion = oDataHana[i].DES_EM;
						llave.codigo = oDataHana[i].RUC_EM;
						vector.push(llave);
					}
					oModel.setProperty("/usuarioRuc", oDataHana[0].RUC_EM);
					oModel.setProperty("/listaEmpresasRUC", vector);
					$.ajax({	
						type: "GET",
						url: this.oBDURl + "T_USER",
					//oModelJson.read("/" + this.varTableT_USER + "?$format=json", {
						success: function (response) {
							var oDataHana = response.value;
							console.log(oDataHana);							
							//var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
							var tamTabla = oDataHana.length;
							var vector = [];
							var llave = {};
							for (var i = 0; i < tamTabla; i++) {
								llave = {};
								llave.descripcion = oDataHana[i].NOM_USUARIO;
								llave.codigo = oDataHana[i].US_USUARIO;
								llave.tipo = oDataHana[i].AUTORIZACION;
								vector.push(llave);
							}
							var model = this.getView().getModel();
							model.setSizeLimit(500);
							oModel.setProperty("/listaProveedoresRUC", vector);
							this.getDataResFacReg();
							//this.obtenerDetracciones();
							this.obtenerHorarios();
							this.getDataCentro();
							this.onAfterRendering2();
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
										this.getView().setBusy(false);
                                sap.m.URLHelper.redirect("logout.html", false);
										dialogMensajeSesion.close();
										//this.getView().setBusy(true);
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
								this.getView().setBusy(false);
                                sap.m.URLHelper.redirect("logout.html", false);
								dialogMensajeSesion.close();
								//this.getView().setBusy(true);
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
        onAfterRendering: function (oEvent) {
			console.log("onAfterRendering");
			var oView = this.getView();
		var oModel = oView.getModel("myParam");	
		this.oBDURl = oModel.getProperty("/listurlBD/bdClientes")
		var realizoMenu = oModel.getProperty("/realizoMenu");
		 if(realizoMenu){
			this._onRouteMatched2();
		 }{
			this.getDataRucEmpresa();	
			this.getDataResFacReg();	
		 }
		
		
		
		
	},
	_onRouteMatched2: function () {
		console.log("_onRouteMatched2");
	
		var oThis = this;
		

			//var nombreUsuario = userModel.oData.displayName;
			var oModel = this.getView().getModel("myParam");
			this.oBDURl = oModel.getProperty("/listurlBD/bdClientes")
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
			this.varTableT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_DETRACCION");
			this.varTableT_HORARIO_ATE = oModel.getProperty("/listTablasOData/clistTablasODataT_HORARIO_ATE");
			//Filtros
            this.metObtenerUsuarioPrincipal();
            ///this.updateServicioAnexosDESC();


		

	},    
		onAfterRendering2: function (oEvent) {

			this.getView().byId("idTextoFooter").addStyleClass("styleTextoFooter");
			this.getView().byId("idRUCProveedor").addStyleClass("styleRUCProveedor");

			var today = new Date(); //this.funcionChangue();
			var dd = today.getDate();
			var MM = today.getMonth() + 1;
			if (dd.toString().length === 1) {
				dd = "0" + dd.toString();
			}
			if (MM.toString().length === 1) {
				MM = "0" + MM.toString();
			}
			var yyyy = today.getFullYear();
			this.byId("idFecha1").setFooter(yyyy + "/" + MM + "/" + dd);
			this.byId("idFecha2").setFooter(yyyy + "/" + MM + "/" + dd);
			var oModel = this.getView().getModel("myParam");
			//oModel.setSizeLimit(1000);
			var idComboTipoDoc = this.getView().byId("idRUC");
			//idComboTipoDoc.getBinding("items").refresh(true);
			var firstItem = idComboTipoDoc.getItems()[0];
			idComboTipoDoc.setSelectedItem(firstItem, true);
            var varRUC = this.getView().byId("idRUC").getSelectedItem();
			oModel.setProperty("/usuarioRuc", varRUC.getKey());
			//var descripcion = varRUC.getBindingContext("myParam").getObject().descripcion;
            debugger;
			/*try {
				oModel.setProperty("/usuarioRuc", varRUC.getKey());
			} catch (error) {
				this.getRouter().navTo("Vista_Login");
				this.getView().setBusy(true);
				window.location.reload();
			}*/
			//oModel.setProperty("/usuarioRucDes", descripcion);
			this.getView().byId("idRUC").setValueState("None");

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

			// Ubicar el proveedor correcto solo validos para usuarios ESTAN
			var varTamCodigoRucProv = oModel.getProperty("/listaProveedoresRUC");
			var varTamCodigoRucProvLogin = oModel.getProperty("/usuarioLogin");
			var varTamCodigoRucProvLoginAlter = oModel.getProperty("/usuarioLoginAlternativo");
			var varopcValidarExisteRUC = "N";
			/*for (var z = 0; z < varTamCodigoRucProv.length; z++) {
				var varCodiProveedor = oModel.getProperty("/listaProveedoresRUC/" + z + "/codigo");
				var varAdminiProveedor = oModel.getProperty("/listaProveedoresRUC/" + z + "/descripcion");
				var varAdminiTipo = oModel.getProperty("/listaProveedoresRUC/" + z + "/tipo");
				if (varTamCodigoRucProvLoginAlter === varCodiProveedor && varAdminiTipo === "ADMIN") {
					varopcValidarExisteRUC = "S";
				}else if (varTamCodigoRucProvLoginAlter === varCodiProveedor && varAdminiTipo === "AVANZ") {
						varopcValidarExisteRUC = "S";
					}
			}
			if (varopcValidarExisteRUC === "S") {

				for (var k = 0; k < varTamCodigoRucProv.length; k++) {
					if (parseInt(oModel.getProperty("/listaProveedoresRUC/" + k + "/codigo"), 10) === parseInt(varTamCodigoRucProvLogin, 10)) {
						var comboDetra = this.getView().byId("idRUCProveedor");
						comboDetra.getBinding("items").refresh(true);
						var firstItem = comboDetra.getItems()[k];
						comboDetra.setSelectedItem(firstItem, true);

						var valor1 = oModel.getProperty("/listaProveedoresRUC/" + k + "/descripcion");
						var valor2 = oModel.getProperty("/listaProveedoresRUC/" + k + "/codigo");
						oModel.setProperty("/usuarioLoginDescripcionRuc", valor1);

						var productInput = this.getView().byId("productInput");
						productInput.setValue(valor2 + " - " + valor1);
					}
				}

				this.getView().byId("idRUCProveedor").setEditable(false);
				this.getView().byId("idRUCProveedor").setVisible(false);
				this.getView().byId("idRUCProveedorNoAdmin1").setVisible(false);
				this.getView().byId("idRUCProveedorNoAdmin2").setVisible(false);
			} else {
				this.getView().byId("idRUCProveedor").setEditable(false);
				this.getView().byId("idRUCProveedor").setVisible(false);
				this.getView().byId("idRUCProveedorNoAdmin1").setVisible(true);
				this.getView().byId("idRUCProveedorNoAdmin2").setVisible(true);
			}
			this.getDataResFacReg();*/
		},
		onBeforeRendering: function (oEvent) {

		},
		onExit: function () {

		},
		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		changeRucEvt: function (evt) {

			var oModel = this.getView().getModel("myParam");
			var usuarioRuc = "";
			var usuarioRucDes = "";
			var item = evt.getSource().getSelectedItem();
			if (item !== null && item !== undefined) {
				usuarioRuc = item.getKey();
				usuarioRucDes = item.getBindingContext("myParam").getObject();
				oModel.setProperty("/usuarioRuc", usuarioRuc);
				oModel.setProperty("/usuarioRucDes", usuarioRucDes.descripcion);
				sap.m.MessageToast.show("Se actualizó el RUC de la empresa : " + usuarioRuc);
				evt.getSource().setValueState("None");
			} else {
				usuarioRuc = "";
				oModel.setProperty("/usuarioRuc", usuarioRuc);
				oModel.setProperty("/usuarioRucDes", usuarioRucDes);
				sap.m.MessageToast.show("No ha seleccionado ningún RUC de la empresa.");
				evt.getSource().setValueState("Error");
			}
			this.getDataResFacReg();
		},

		changeRucEvtProv: function (evt) {

			var oModel = this.getView().getModel("myParam");
			var usuarioRucProv = "";
			var item = evt.getSource().getSelectedItem();
			if (item !== null && item !== undefined) {
				usuarioRucProv = item.getKey();
				oModel.setProperty("/usuarioLogin", usuarioRucProv);
				sap.m.MessageToast.show("Se actualizó el RUC del proveedor : " + usuarioRucProv);
				evt.getSource().setValueState("None");

				var varListaRucDes = oModel.getProperty("/listaProveedoresRUC");
				for (var i = 0; i < varListaRucDes.length; i++) {
					if (varListaRucDes[i].codigo === usuarioRucProv) {
						var varDescripcionDelRuc = varListaRucDes[i].descripcion;
					}
				}
				oModel.setProperty("/usuarioLoginDescripcionRuc", varDescripcionDelRuc);

			} else {
				usuarioRucProv = "";
				oModel.setProperty("/usuarioLogin", usuarioRucProv);
				sap.m.MessageToast.show("No ha seleccionado ningún RUC de proveedor.");
				evt.getSource().setValueState("Error");
			}
			this.getItemVisibles();
		},

		handleValueHelp: function (oEvent) {

			this.inputId = oEvent.getSource().getId();
			var oModel = this.getView().getModel("myParam");
			sap.ui.getCore().setModel(oModel);

			var pressDialog = new sap.m.SelectDialog({
				noDataText: "No existen datos de proveedores",
				title: "Lista de Proveedores",
				search: [this.handleSearch, this],
				confirm: [this.handleClose, this],
				close: [this.handleClose, this],
				items: {
					path: "myParam>/listaProveedoresRUC",
					template: new sap.m.StandardListItem({
						icon: "sap-icon://building",
						title: "{myParam>descripcion}",
						description: "RUC : {myParam>codigo}",
						type: "Active"
					})
				},
				beginButton: new sap.m.Button({
					text: "Close",
					type: "Reject",
					press: function () {
						pressDialog.close();
					},
					afterClose: function () {
						pressDialog.destroy();
					}
				})
			});
			pressDialog.setModel(oModel);
			this.getView().addDependent(pressDialog);
			pressDialog.open();
		},

		handleSearch: function (oEvt) {

			var sValue = oEvt.getParameter("value");

			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("codigo", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("descripcion", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			});
			
			var oBinding = oEvt.getSource().getBinding("items");
			oBinding.filter([oFilter], "Application");
		},

		handleClose: function (oEvent) {

			var oModel = this.getView().getModel("myParam");

			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts.length) {
				var valor = aContexts.map(function (oContext) {
					return oContext.getObject().descripcion;
				}).join(", ");
				var valor2 = aContexts.map(function (oContext) {
					return oContext.getObject().codigo;
				}).join(", ");
				var productInput = this.getView().byId("productInput");
				productInput.setValue(valor2 + " - " + valor);
				oModel.setProperty("/usuarioLogin", valor2);
				sap.m.MessageToast.show("Se actualizó el RUC del proveedor : " + valor2);
				oModel.setProperty("/usuarioLoginDescripcionRuc", valor);
				this.getDataResFacReg();
				this.getItemVisibles();
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		btnItemSin: function () {
			var dialog = new sap.m.Dialog({
				icon: "sap-icon://batch-payments",
				title: "Registro factura por Misceláneos",
				type: "Message",
				state: "Information",
				content: [
					new sap.ui.layout.VerticalLayout({
						width: "100%",
						content: [
							new sap.m.Toolbar({
								width: "100%",
								content: [
									new sap.m.Text({
										text: "¿De qué forma quiere realizar dicho procedimiento?",
										width: "100%"
									})
								]
							}),
							new sap.m.Button({
								text: "Carga XML",
								icon: "sap-icon://upload",
								width: "100%",
								type: "Emphasized",
								press: function () {
									this.getRouter().navTo("Vista_Registro_Factura_Sin_Vale");
									dialog.close();
								}.bind(this)
							}),
							new sap.m.Button({
								text: "Manual",
								icon: "sap-icon://keyboard-and-mouse",
								width: "100%",
								type: "Emphasized",
								press: function () {
									this.getRouter().navTo("Vista_Registro_Factura_Manual");
									dialog.close();
								}.bind(this)
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: "Cerrar",
					icon: "sap-icon://decline",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();

		},
		btnItemFac: function () {
			var dialog = new sap.m.Dialog({
				icon: "sap-icon://expense-report",
				title: "Registro de factura",
				type: "Message",
				state: "Information",
				content: [
					new sap.ui.layout.VerticalLayout({
						width: "100%",
						content: [
							new sap.m.Toolbar({
								width: "100%",
								content: [
									new sap.m.Text({
										text: "¿De qué forma quiere realizar dicho procedimiento?",
										width: "100%"
									})
								]
							}),
							new sap.m.Button({
								text: "Carga XML",
								icon: "sap-icon://upload",
								width: "100%",
								type: "Emphasized",
								press: function () {
									this.getRouter().navTo("Vista_Registro_Factura");
									dialog.close();
								}.bind(this)
							}),
							new sap.m.Button({
								text: "Manual",
								icon: "sap-icon://keyboard-and-mouse",
								width: "100%",
								type: "Emphasized",
								press: function () {
									this.getRouter().navTo("Vista_Registro_Factura_Manual");
									dialog.close();
								}.bind(this)
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: "Cerrar",
					icon: "sap-icon://decline",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();

		},

		btnItemFacNew: function () {
			this.getRouter().navTo("Vista_Registro_Factura");
		},
		btnItemSinNew: function () {
			this.getRouter().navTo("Vista_Registro_Factura_Sin_Vale");
			this.getDataCentro();
		},
		btnItem1: function () {

			this.getRouter().navTo("Vista_Orden_Compra");
		},

		btnItem2: function () {
			this.getRouter().navTo("Vista_Reporte_Factura");
		},

		btnItemConsignacion: function () {
			this.getRouter().navTo("Vista_Registro_Consignacion");
		},

		btnItemDevSinPedido: function () {
			this.getRouter().navTo("Vista_Registro_DevSinPedido");
		},

		btnItemReporConsignacion: function () {
			this.getRouter().navTo("Vista_Reporte_Consiganciones");
		},

		btnItemContratista: function () {
			//this.btnDialogMensajeApliNotFound();
			this.getRouter().navTo("Vista_Registro_Contratista");
		},

		btnItemAdmiUsuarios: function () {
			//this.btnDialogMensajeApliNotFound();
			this.getRouter().navTo("Vista_Administrador_Usuarios");
		},

		btnItemPedConDevo: function () {
			//this.btnDialogMensajeApliNotFound();
			this.getRouter().navTo("Vista_Registro_PedConDev");
		},

		btnItem10: function () {
			this.getRouter().navTo("Vista_Reporte_Fac_Registradas");
		},
		
		btnItemVale: function () {
			this.getRouter().navTo("Vista_Reporte_Vale");
		},

		btnEditar: function (evt) {

			var oTileContainer = this.byId("idContainer");
			var newValue = !oTileContainer.getEditable();
			oTileContainer.setEditable(newValue);
			evt.getSource().setText(newValue ? "Guardar" : "Editar");
		},

		getDataCentro: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var varRUC = oModel.getProperty("/usuarioRuc");
			var filters = [];
			var filter;

			filter = new sap.ui.model.Filter("RUC_EM", sap.ui.model.FilterOperator.EQ, varRUC);
			filters.push(filter);

			//oModelJson.read("/T_EMPs?$format=json", {
			oModelJson.read("/" + this.varTableT_EMP + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var tamTabla = oModelJSON.getData().length;
					var vector = [];
					var llave = {};
					for (var i = 0; i < tamTabla; i++) {
						llave = {};
						llave.descripcion = oModelJSON.getData()[i].DES_CEN;
						llave.codigo = oModelJSON.getData()[i].COD_CEN;
						vector.push(llave);
					}
					oModel.setProperty("/listCentroEmp", vector);
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listCentroEmp", []);
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
                                sap.m.URLHelper.redirect("logout.html", false);
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
					oModel.setSizeLimit(vector.length);
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
								text: "No se pudo establecer conexión con la base de datos. Por favor, acceder nuevamente o contactese con el área de TI.",
								wrapping: true,
								width: "100%"
							})
						],
						state: "Warning",
						type: "Message",
						endButton: new sap.m.Button({
							press: function () {
                                sap.m.URLHelper.redirect("logout.html", false);
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

		/*funcionChangue: function(){
			
			var carousel = this.getView().byId("carouselSample");
			setTimeout(function() { carousel.next(); }, 2500);
			//carousel.placeAt("content");
		}*/

		btnDialogMensajeApliNotFound: function () {

			var dialog = new sap.m.Dialog({
				icon: "sap-icon://expense-report",
				title: "Mensaje",
				type: "Message",
				state: "Information",
				content: [
					new sap.m.Text({
						text: "Este Item esta en Desarrollo",
						width: "100%"
					})
				],
				beginButton: new sap.m.Button({
					text: "Aceptar",
					icon: "sap-icon://accept",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		getItemVisibles: function () {
			console.log("getItemVisibles");
			this.getView().setBusy(true);

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var varUsuario = oModel.getProperty("/usuarioLogin");
			var usuarioReal = oModel.getProperty("/usuarioReal");
			var tipoDeUsuario = oModel.getProperty("/tipoDeUsuario");
			
			console.log(usuarioReal);
			console.log(tipoDeUsuario);
			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);

			var filters = [];
			var filter;
			if(tipoDeUsuario === "AVANZ"){
				filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.EQ, usuarioReal);
			filters.push(filter);
			}else{
			filter = new sap.ui.model.Filter("US_USUARIO", sap.ui.model.FilterOperator.EQ, varUsuario);
			filters.push(filter);
			}
			console.log("/" + this.varTableT_USER + "?$format=json");
			console.log(filters);
			//oModelJson.read("/T_USERs?$format=json", {
			oModelJson.read("/" + this.varTableT_USER + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var vartblUser = oModelJSON.getData();
					console.log(vartblUser[0]);
					if (vartblUser.length !== 0) {
						var varAutorizacion = vartblUser[0].AUTORIZACION;
						var varSeccion1 = vartblUser[0].SEC_1;
						var varSeccion2 = vartblUser[0].SEC_2;
						var varSeccion3 = vartblUser[0].SEC_3;
						var varSeccion4 = vartblUser[0].SEC_4;
						var varSeccion5 = vartblUser[0].SEC_5;
						var varSeccion6 = vartblUser[0].SEC_6;
						var varSeccion7 = vartblUser[0].SEC_7;
						var varSeccion8 = vartblUser[0].SEC_8;

						this.getView().byId("idItem10").setVisible(true);
						if (varAutorizacion === "ADMIN") {
							this.getView().byId("idItem1").setVisible(true);
							this.getView().byId("idItem2").setVisible(true);
							this.getView().byId("idItem3").setVisible(false);
							this.getView().byId("idItem4").setVisible(false);
							this.getView().byId("idItem5").setVisible(false);
							this.getView().byId("idItem6").setVisible(true);
							this.getView().byId("idItem7").setVisible(true);
							this.getView().byId("idItem8").setVisible(false);
							this.getView().byId("idItem9").setVisible(true);
						} else if (varAutorizacion === "AVANZ") {
							if (varSeccion1 === "x") {
								this.getView().byId("idItem1").setVisible(true);
							} else {
								this.getView().byId("idItem1").setVisible(false);
							}

							if (varSeccion2 === "x") {
								this.getView().byId("idItem2").setVisible(true);
							} else {
								this.getView().byId("idItem2").setVisible(false);
							}

							if (varSeccion3 === "x") {
								this.getView().byId("idItem3").setVisible(true);
							} else {
								this.getView().byId("idItem3").setVisible(false);
							}

							if (varSeccion4 === "x") {
								this.getView().byId("idItem4").setVisible(true);
							} else {
								this.getView().byId("idItem4").setVisible(false);
							}

							if (varSeccion5 === "x") {
								this.getView().byId("idItem5").setVisible(true);
							} else {
								this.getView().byId("idItem5").setVisible(false);
							}

							if (varSeccion6 === "x") {
								this.getView().byId("idItem6").setVisible(true);
							} else {
								this.getView().byId("idItem6").setVisible(false);
							}

							if (varSeccion7 === "x") {
								this.getView().byId("idItem7").setVisible(true);
							} else {
								this.getView().byId("idItem7").setVisible(false);
							}

							if (varSeccion8 === "x") {
								this.getView().byId("idItem8").setVisible(true);
							} else {
								this.getView().byId("idItem8").setVisible(false);
							}
							
							// this.getView().byId("idItem1").setVisible(false);
							// this.getView().byId("idItem2").setVisible(false);
							// this.getView().byId("idItem3").setVisible(false);
							// this.getView().byId("idItem4").setVisible(false);
							// this.getView().byId("idItem5").setVisible(false);
							// this.getView().byId("idItem6").setVisible(false);
							
							// this.getView().byId("idItem10").setVisible(true);
							// this.getView().byId("idItem7").setVisible(true);
							// this.getView().byId("idItem11").setVisible(true);
							// this.getView().byId("idItem8").setVisible(true);
							
							this.getView().byId("idItem9").setVisible(false);
						
							
						}else {
							if (varSeccion1 === "x") {
								this.getView().byId("idItem1").setVisible(true);
							} else {
								this.getView().byId("idItem1").setVisible(false);
							}

							if (varSeccion2 === "x") {
								this.getView().byId("idItem2").setVisible(true);
							} else {
								this.getView().byId("idItem2").setVisible(false);
							}

							if (varSeccion3 === "x") {
								this.getView().byId("idItem3").setVisible(true);
							} else {
								this.getView().byId("idItem3").setVisible(false);
							}

							if (varSeccion4 === "x") {
								this.getView().byId("idItem4").setVisible(true);
							} else {
								this.getView().byId("idItem4").setVisible(false);
							}

							if (varSeccion5 === "x") {
								this.getView().byId("idItem5").setVisible(true);
							} else {
								this.getView().byId("idItem5").setVisible(false);
							}

							if (varSeccion6 === "x") {
								this.getView().byId("idItem6").setVisible(true);
							} else {
								this.getView().byId("idItem6").setVisible(false);
							}

							if (varSeccion7 === "x") {
								this.getView().byId("idItem7").setVisible(true);
							} else {
								this.getView().byId("idItem7").setVisible(false);
							}

							if (varSeccion8 === "x") {
								this.getView().byId("idItem8").setVisible(true);
							} else {
								this.getView().byId("idItem8").setVisible(false);
							}
							this.getView().byId("idItem9").setVisible(false);
						}
						this.getView().setBusy(false);
					} else {
						this.getView().byId("idItem1").setVisible(false);
						this.getView().byId("idItem2").setVisible(false);
						this.getView().byId("idItem3").setVisible(false);
						this.getView().byId("idItem4").setVisible(false);
						this.getView().byId("idItem5").setVisible(false);
						this.getView().byId("idItem6").setVisible(false);
						this.getView().byId("idItem7").setVisible(false);
						this.getView().byId("idItem8").setVisible(false);
						this.getView().byId("idItem9").setVisible(false);
						this.getView().byId("idItem10").setVisible(false);
						this.getView().setBusy(false);
					}
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

		getDataResFacReg: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

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

			sorter = new sap.ui.model.Sorter("FC_FEC_REGISTRO", false);
			sorters.push(sorter);
			oModelJson.read("/" + this.varTableT_FAC + "?$format=json", {
				filters: allFilters,
				sorters: sorters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var tamTabla = oModelJSON.getData().length;
					var vector = [];

					var llave = {};
					for (var i = 0; i < tamTabla; i++) {
						llave = {};
						llave.FC_FEC_REGISTRO = oModelJSON.getData()[i].FC_FEC_REGISTRO;
						vector.push(llave);
					}
					oModel.setProperty("/listT_FAC_Details", vector);

					//Reporte de factura
					this.getView().byId("idItem7Registro").setValue(vector.length);

					this.getView().byId("idItem7Registro").setValueColor("Good");
					for (var j = 0; j < vector.length; j++) {
						if (vector[j].FC_FEC_REGISTRO === "") {
							this.getView().byId("idItem7Registro").setValueColor("Error");
						}
					}
				}.bind(this),
				error: function (oError) {}.bind(this)
			});
		}
	});
});