sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Registro_Consignacion", {

		varTableURL: "",
		varTableDocument: "",
		varTableDocumentConsultar: "",
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

		_file: "",

		ordenCompraGlobal: null,
		posFacturaGlobal: null,
		fileGlobal: null,
		IGVGloba: null,
		varGlobalContDocu: 0,
		varContValidar: 0,
		varRucDeLaEmpresa: "",
		varTotalInsert: 0,
		varTotalInsertEje: 0,
		varTotalInsertEjeError: 0,
		varTotalInsertEjeErrorVal: false,
		varEstadoSunat1: null,
		onAfterRendering: function () {
			var oSplitApp = this.getView().byId("SplitAppDemo1");
			var oMasterNav = oSplitApp.getAggregation("_navMaster");
			oMasterNav.setVisible(false);

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			// Tablas
			this.varTableURL = oModel.getProperty("/listTablasOData/clistTablasODataURL");
			this.varTableDocument = oModel.getProperty("/listTablasOData/clistTablasODataDocument");
			this.varTableDocumentConsultar = oModel.getProperty("/listTablasOData/clistTablasODataDocumentConsultar");
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
		},
		onInit: function () {

			var oThis = this;
			oThis.getRouter().getRoute("Vista_Registro_Consignacion").attachMatched(this._onRouteMatched, this);
			this.getView().byId("idTableItemDetalleFac").setSelectionMode("Single");
			this.getView().byId("idTableItemDetalleFac").setSelectionBehavior("RowOnly");
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("quickViewCard").addStyleClass("miCarta");
			this.getView().byId("SplitAppDemo1").addStyleClass("miSplit");
			this.getView().byId("idNav").addStyleClass("miIconoBlanco");

		},

		_onRouteMatched: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			this.getView().byId("idTotalDescuentos").setValue("     ");
			this.getView().byId("idTotalIGV").setValue("     ");
			this.getView().byId("idImporteTotal").setValue("     ");
			this.varRucDeLaEmpresa = oModel.getProperty("/usuarioRuc");
			this.getView().byId("idValidacionFacySunat1").setText("Estado del comprobante a la fecha de la consulta : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat1").setType("Information");
			this.getView().byId("idValidacionFacySunat2").setText("Estado del contribuyente a la fecha de emisión : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat2").setType("Information");
			this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat3").setType("Information");
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
			oModel.setProperty("/listItemDetalleFactura", []);

			// Borrar seleccion checks de las tablas

			this.getView().byId("idXML").setValue("");
			this.getView().byId("idFacturar").setEnabled(false);
			this.getView().byId("idAnadirDocSus").setEnabled(false);
			this.getView().byId("idValidacionFacAsig").setText("Sin items a asignar");
			this.getView().byId("idValidacionFacAsig").setType("Information");
			this.getView().byId("idValidacionDoc").setText("Sin Documentos Sustentos a asignar");
			this.getView().byId("idValidacionDoc").setType("Information");
			this.getView().byId("idErrores").setVisible(false);
			var varUsuario = oModel.getProperty("/usuarioLogin");
			var varRUC = oModel.getProperty("/usuarioRuc");
			var filterOrdenCompra = [];
			var filter;
			filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varUsuario);
			filterOrdenCompra.push(filter);
			filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, this.varRucDeLaEmpresa);
			filterOrdenCompra.push(filter);
			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			//oModelJson.read("/T_OC_DETs?$format=json", {
			oModelJson.read("/" + this.varTableT_OC_DET + "?$format=json", {
				filters: filterOrdenCompra,
				success: function (response) {

					try {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						var vector = [];
						var llave = {};
						for (var i = 0; i < tamTabla; i++) {
							llave = oModelJSON.getData()[i];
							llave.selectItem = false;
							vector.push(llave);
						}
						oModel.setProperty("/listaValesIngreso", vector);
					} catch (err) {
						oModel.setProperty("/listaValesIngreso", []);
					}
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listaValesIngreso", []);
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

			var oModelJson2 = new sap.ui.model.odata.v2.ODataModel(url, true);
			//oModelJson2.read("/T_CON_DETs?$format=json", {
			oModelJson2.read("/" + this.varTableT_CON_DET + "?$format=json", {
				filters: filterOrdenCompra,
				success: function (response) {

					try {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						var vector = [];
						var llave = {};
						for (var i = 0; i < tamTabla; i++) {
							llave = oModelJSON.getData()[i];
							llave.selectItem = false;
							vector.push(llave);
						}
						oModel.setProperty("/listaValesIngresoConsig", vector);
					} catch (err) {
						oModel.setProperty("/listaValesIngresoConsig", []);
					}
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/listaValesIngresoConsig", []);
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

			var comboTipo = this.getView().byId("idComboTipo");
			comboTipo.getBinding("items").refresh(true);
			var firstItem = comboTipo.getItems()[0];
			comboTipo.setSelectedItem(firstItem, true);
			this.getView().byId("idComboTipo").setValueState("None");

			var comboDetra = this.getView().byId("idCodigoDetra");
			comboDetra.getBinding("items").refresh(true);
			firstItem = comboDetra.getItems()[0];
			comboDetra.setSelectedItem(firstItem, true);
			this.getView().byId("idCodigoDetra").setValueState("None");

			this.getView().byId("idComboTipo").setEnabled(false);
			this.varContValidar = 0;

			var model = this.getView().getModel("myParam");
			model.setProperty("/listTablaDocumentos", []);

			// Tablas
			this.varTableURL = oModel.getProperty("/listTablasOData/clistTablasODataURL");
			this.varTableDocument = oModel.getProperty("/listTablasOData/clistTablasODataDocument");
			this.varTableDocumentConsultar = oModel.getProperty("/listTablasOData/clistTablasODataDocumentConsultar");
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

			this.updateServicioSunat();
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

		refreshData: function (refreshParameters) {

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
		btnBuscarItem: function (oEvent) {
			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var myParam = this.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var listItemDetalleFactura = oModel.getProperty("/listItemDetalleFactura");
			// Obtener el ID principal de lo seleccionado
			var valObject = oContext.getPath();
			this.posFacturaGlobal = valObject;
			var pathFacturaItem = valObject;
			var vector = [];
			var llaveSeleccionada = {};
			llaveSeleccionada.POS = oModel.getProperty(valObject + "/clistItemDetalleFacturaPosicion");
			llaveSeleccionada.MONEDA = oModel.getProperty(valObject + "/clistItemDetalleFacturaMoneda");
			llaveSeleccionada.COD = oModel.getProperty(valObject + "/clistItemDetalleFacturaCodigo");
			llaveSeleccionada.MATERIAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaDescripcion");
			var netoxItem = parseFloat(oModel.getProperty(valObject + "/clistItemDetalleFacturaValorVenxItem")).toFixed(2);
			llaveSeleccionada.NETO = netoxItem;
			llaveSeleccionada.ORDEN_COMPRA = oModel.getProperty(valObject + "/clistItemsOrdenCompra");

			llaveSeleccionada.TOTAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaTotal");
			oModel.setProperty("/selectItemTodos/opc", false);

			var listaValesIngreso = oModel.getProperty("/listaValesIngresoConsig");
			var listaValesIngresoC = oModel.getProperty("/listaValesIngresoConsig");
			oModel.setProperty("/listTotalValesIngreso", listaValesIngreso);
			var listaValesIngresoSalvado = listaValesIngreso;
			var total = 0;
			var selectedItem = this.getView().byId("idComboTipo").getSelectedItem();
			var llaveTipo = selectedItem.getKey();
			//var llaveTipo = "N";
			var vectorEliminar = [];
			var realizar = true;
			for (var k = 0; k < listaValesIngreso.length; k++) {
				realizar = true;
				for (var l = 0; l < listItemDetalleFactura.length; l++) {

					if (listItemDetalleFactura[l].clistItemDetalleFacturaPosicion !== llaveSeleccionada.POS) {
						for (var m = 0; m < listItemDetalleFactura[l].clistItemsOrdenCompra.length; m++) {
							var ordenCompraSelect = listItemDetalleFactura[l].clistItemsOrdenCompra[m];
							if (listaValesIngreso[k].ZEILE === ordenCompraSelect.ZEILE &&
								listaValesIngreso[k].MBLNR === ordenCompraSelect.MBLNR) {
								realizar = false;
							}
						}
					}

				}
				if (realizar) {
					if (listaValesIngreso[k].FLAC !== "x") {
						vectorEliminar.push(listaValesIngreso[k]);
					}
				}
			}

			listaValesIngreso = vectorEliminar;

			for (var j = 0; j < listaValesIngreso.length; j++) {
				listaValesIngreso[j].selectItem = false;
			}
			for (var i = 0; i < llaveSeleccionada.ORDEN_COMPRA.length; i++) {
				total += parseFloat(llaveSeleccionada.ORDEN_COMPRA[i].WRBTR.toString().replace(',', ''));
				for (var j = 0; j < listaValesIngreso.length; j++) {
					if (listaValesIngreso[j].ZEILE === llaveSeleccionada.ORDEN_COMPRA[i].ZEILE &&
						listaValesIngreso[j].MBLNR === llaveSeleccionada.ORDEN_COMPRA[i].MBLNR) {
						listaValesIngreso[j].selectItem = true;
					}
				}
			}

			total = total.toFixed(2);
			vector.push(llaveSeleccionada);
			oModel.setProperty("/listaValesIngresoConsig", listaValesIngreso);
			myParam.setProperty("/facturaSeleccionada", vector);

			var oTable = new sap.ui.table.Table({
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				width: "35.5rem",
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
				width: "12rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Descripción del material"
				}),
				template: new sap.m.Text({
					text: "{MATERIAL}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Valor Sin IGV"
				}),
				template: new sap.m.Text({
					text: "{NETO}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Moneda"
				}),
				template: new sap.m.Text({
					text: "{MONEDA}"
				})
			}));
			oTable.setModel(myParam);

			var oTableItem = new sap.ui.table.Table("idTableListaTotal", {
				visibleRowCount: 5,
				alternateRowColors: true,
				selectionMode: "None",
				width: "72.8rem",
				rows: "{/listaValesIngresoConsig}",
				noData: [
					new sap.m.Text({
						text: "Sin documentos de ingreso encontrados."
					})
				]
			});
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "3.5rem",
				hAlign: "Center",
				label: new sap.m.CheckBox({
					selected: "{myParam>/selectItemTodos/opc}",
					valueState: "Warning",
					select: function (evt) {
						// Llamar modelo
						var oThis = this;
						var oModel = oThis.getView().getModel("myParam");
						var listaValesIngresoConsig = oModel.getProperty("/listaValesIngresoConsig");

						////////////////////////////////////////////////////////////////
						var filter;
						var filters1 = [];
						var filters2 = [];
						var filters3 = [];
						var filters4 = [];
						var filtersT = [];
						var numeroConteo = 0;
						if (sap.ui.getCore().byId("idCheckFecVale").getSelected()) {
							filter = new sap.ui.model.Filter("BUDATI", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idFecVale").getValue());
							filters1.push(filter);
							filtersT.push(new sap.ui.model.Filter(filters1, false));
							numeroConteo++;
						}
						if (sap.ui.getCore().byId("idCheckVale").getSelected()) {
							filter = new sap.ui.model.Filter("MBLNR", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idNroVale").getValue());
							filters2.push(filter);
							filtersT.push(new sap.ui.model.Filter(filters2, false));
							numeroConteo++;
						}
						if (sap.ui.getCore().byId("idCheckGuia").getSelected()) {
							filter = new sap.ui.model.Filter("MAKTX", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idGuia").getValue());
							filters3.push(filter);
							filtersT.push(new sap.ui.model.Filter(filters3, false));
							numeroConteo++;
						}
						if (sap.ui.getCore().byId("idCheckCodMaterial").getSelected()) {
							filter = new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idCodMaterial").getValue());
							filters4.push(filter);
							filtersT.push(new sap.ui.model.Filter(filters4, false));
							numeroConteo++;
						}

						var totalVale = 0;
						if (numeroConteo !== 0) {
							var list = sap.ui.getCore().byId("idTableListaTotal");
							var binding = list.getBinding("rows");
							binding.filter(new sap.ui.model.Filter(filtersT, true));

							/////////////////////////////////////////////////////////
							//var varTam = oModel.getProperty("/listaValesIngresoConsig").length;
							var varTam2 = binding.aIndices.length;
							if (oModel.getProperty("/selectItemTodos/opc") === false) {
								for (var i = 0; i < varTam2; i++) {
									listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
									oModel.setProperty("/selectItemTodos/opc", true);
									//ACTUALIZAR SUBTOTAL
									totalVale += parseFloat(listaValesIngresoConsig[binding.aIndices[i]].WRBTR.toString().replace(',', ''), 10);
								}
							} else {
								for (var i = 0; i < varTam2; i++) {
									listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
									oModel.setProperty("/selectItemTodos/opc", false);
								}
							}
							//////////////////////////////////////////////////////////7
						} else {
							/////////////////////////////////////////////////////////
							var varTam = oModel.getProperty("/listaValesIngresoConsig").length;
							if (oModel.getProperty("/selectItemTodos/opc") === false) {
								for (var i = 0; i < varTam; i++) {
									listaValesIngresoConsig[i].selectItem = true;
									oModel.setProperty("/selectItemTodos/opc", true);
									//ACTUALIZAR SUBTOTAL
									totalVale += parseFloat(listaValesIngresoConsig[i].WRBTR.toString().replace(',', ''), 10);
								}
							} else {
								for (var i = 0; i < varTam; i++) {
									listaValesIngresoConsig[i].selectItem = false;
									oModel.setProperty("/selectItemTodos/opc", false);
								}
							}
							//////////////////////////////////////////////////////////7
						}
						var subTotal = [];
						var llaveSub = {};
						llaveSub.total = totalVale.toFixed(2);
						subTotal.push(llaveSub);
						myParam.setProperty("/subTotal", subTotal);
						////////////////////////////////////////////////////////////////

					}.bind(this)
				}),
				template: new sap.m.CheckBox({
					selected: "{selectItem}",
					valueState: "Warning",
					select: function (evt) {
						var objeto = evt.getSource().getBindingContext().getObject();
						var posicion = objeto.DE_POSICION;
						var ordenCompra = objeto.DE_NUMERO_ORDEN;
						var listaValesIngreso = oModel.getProperty("/listaValesIngresoConsig");
						var vectorVerificacion = [];
						var realizar = true;
						var motivo = "";
						for (var v = 0; v < listaValesIngreso.length; v++) {
							if (listaValesIngreso[v].selectItem) {
								var varMonedaOC = oModel.getProperty("/listItemCabeceraFactura/8/value");
								if (listaValesIngreso[v].BWAER === varMonedaOC) {
									vectorVerificacion.push(listaValesIngreso[v]);
								} else {
									realizar = false;
									motivo = "No se puede asignar una Posición con moneda distinta de la Factura.";
									v = listaValesIngreso.length;
								}
							}

						}

						if (!realizar) {
							evt.getSource().setSelected(false);
							sap.m.MessageToast.show(motivo);
						} else {

							//ACTUALIZAR SUBTOTAL
							var totalVale = 0;
							for (var v = 0; v < listaValesIngreso.length; v++) {
								if (listaValesIngreso[v].selectItem) {
									totalVale += parseFloat(listaValesIngreso[v].WRBTR.toString().replace(',', ''), 10);
								}
							}
							var subTotal = [];
							var llaveSub = {};
							llaveSub.total = totalVale.toFixed(2);
							subTotal.push(llaveSub);
							myParam.setProperty("/subTotal", subTotal);
						}
						// netoxItem						
					}.bind(this)
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Inicio de Periodo"
				}),
				template: new sap.m.Text({
					text: "{BUDATI}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Fin de Periodo"
				}),
				template: new sap.m.Text({
					text: "{BUDATF}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Ejer. del Doc. Material"
				}),
				template: new sap.m.Text({
					text: "{MJAHR}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Doc. Material"
				}),
				template: new sap.m.Text({
					text: "{MBLNR}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Pos. Doc. Material"
				}),
				template: new sap.m.Text({
					text: "{ZEILE}"
				})
			}));
			/*oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Fecha de Doc. en Doc."
				}),
				template: new sap.m.Text({
					text: "{BLDAT}"
				})
			}));*/
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Código"
				}),
				template: new sap.m.ObjectNumber({
					number: "{MATNR}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "20rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Descripción"
				}),
				template: new sap.m.ObjectNumber({
					number: "{MAKTX}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "6rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cantidad"
				}),
				template: new sap.m.ObjectNumber({
					number: "{BSTMG}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Uni. Medida"
				}),
				template: new sap.m.ObjectNumber({
					number: "{BSTME}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe"
				}),
				template: new sap.m.ObjectNumber({
					number: "{WRBTR}",
					unit: "{BWAER}"
				})
			}));
			oTableItem.setModel(myParam);

			var oTableSubTotal = new sap.ui.table.Table({
				id: "idTableTotal",
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				columnHeaderVisible: false,
				width: "72.8rem",
				rows: "{/subTotal}"
			});
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "3.5rem",
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
				width: "8rem",
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
				width: "5rem",
				hAlign: "Left",
				template: new sap.m.Text({
					text: ""
				})
			}));
			oTableSubTotal.addColumn(new sap.ui.table.Column({
				width: "9rem",
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
					state: {
						path: "total",
						formatter: function (total) {

							var valorNetoMas5 = parseFloat(netoxItem) + 0.05;
							valorNetoMas5 = valorNetoMas5.toFixed(2);
							var valorNetoMenos5 = parseFloat(netoxItem) - 0.05;
							valorNetoMenos5 = valorNetoMenos5.toFixed(2);
							var totalValor = parseFloat(total);
							if (totalValor <= parseFloat(valorNetoMas5) && totalValor >= parseFloat(valorNetoMenos5)) {
								sap.m.MessageToast.show("El total seleccionado es válido con el valor sin IGV.");
								// sap.ui.getCore().byId("idButtonAceptar").setEnabled(true);
								return "Success";
							} else if (totalValor > parseFloat(valorNetoMas5)) {
								sap.m.MessageToast.show("El total seleccionado es superior al valor sin IGV.");
								// sap.ui.getCore().byId("idButtonAceptar").setEnabled(false);
								return "Error";
							} else {
								sap.m.MessageToast.show("El total seleccionado es inferior al valor sin IGV.");
								// sap.ui.getCore().byId("idButtonAceptar").setEnabled(false);
								return "Error";
							}
						}.bind(this)
					}

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
			var oDialogSelectItems = new sap.m.Dialog("idDialogSelectItems", {

				title: "Documentos de Material",
				icon: "sap-icon://activity-2",
				contentWidth: "auto",
				resizable: true,
				draggable: true,
				type: "Message",
				content: [
					hbox,
					new sap.m.Toolbar({
						width: "100%",
						height: "auto",
						content: [

							new sap.ui.layout.VerticalLayout({
								width: "20%",
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckFecVale",
										text: "Inicio de Periodo",
										valueState: "Warning"
									}),
									new sap.m.DatePicker("idFecVale", {
										valueStateText: "El campo Inicio de Periodo no debe estar vacío.",
										valueFormat: "dd-MM-yyyy",
										displayFormat: "dd-MM-yyyy",
										dateValue: new Date(),
										width: "100%"
									})
								]
							}),
							new sap.ui.layout.VerticalLayout({
								width: "20%",
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckVale",
										text: "Doc. de Material",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 10,
										id: "idNroVale",
										valueStateText: "El campo Doc. de Material no debe estar vacío.",
										placeholder: "Ingrese Doc. de Material (10)...",
										width: "100%"
									})
								]
							}),
							new sap.ui.layout.VerticalLayout({
								width: "20%",
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckCodMaterial",
										text: "Código",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idCodMaterial",
										valueStateText: "El campo Código no debe estar vacío.",
										placeholder: "Ingrese Código (16)...",
										width: "100%"
									})
								]
							}),
							new sap.ui.layout.VerticalLayout({
								width: "20%",
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckGuia",
										text: "Descripción",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idGuia",
										valueStateText: "El campo Descripción no debe estar vacío.",
										placeholder: "Ingrese Descripción (16)...",
										width: "100%"
									})
								]
							}),

							new sap.m.ToolbarSpacer({}),
							new sap.m.Button({
								type: "Emphasized",
								tooltip: "Filtrar",
								text: "Filtrar",
								icon: "sap-icon://filter",
								visible: true,
								press: function () {
									var inputs = [];
									var canContinue = true;

									////////////////////////////////////////////////////////////////
									var filter1;
									var filters1 = [];
									var filters2 = [];
									var filters3 = [];
									var filters4 = [];
									var filtersT = [];
									var numeroConteo = 0;
									if (sap.ui.getCore().byId("idCheckFecVale").getSelected()) {
										filter1 = new sap.ui.model.Filter("BUDATI", sap.ui.model.FilterOperator.Contains, "");
										filters1.push(filter1);
										filtersT.push(new sap.ui.model.Filter(filters1, false));
										numeroConteo++;
									}
									if (sap.ui.getCore().byId("idCheckVale").getSelected()) {
										filter1 = new sap.ui.model.Filter("MBLNR", sap.ui.model.FilterOperator.Contains, "");
										filters2.push(filter1);
										filtersT.push(new sap.ui.model.Filter(filters2, false));
										numeroConteo++;
									}
									if (sap.ui.getCore().byId("idCheckGuia").getSelected()) {
										filter1 = new sap.ui.model.Filter("MAKTX", sap.ui.model.FilterOperator.Contains, "");
										filters3.push(filter1);
										filtersT.push(new sap.ui.model.Filter(filters3, false));
										numeroConteo++;
									}
									if (sap.ui.getCore().byId("idCheckCodMaterial").getSelected()) {
										filter1 = new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.Contains, "");
										filters4.push(filter1);
										filtersT.push(new sap.ui.model.Filter(filters4, false));
										numeroConteo++;
									}

									if (numeroConteo !== 0) {
										var list = sap.ui.getCore().byId("idTableListaTotal");
										var binding1 = list.getBinding("rows");
										binding1.filter(new sap.ui.model.Filter(filtersT, true));
									}
									////////////////////////////////////////////////////////////////

									if (sap.ui.getCore().byId("idCheckFecVale").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idFecVale"));
									}
									if (sap.ui.getCore().byId("idCheckVale").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idNroVale"));
									}
									if (sap.ui.getCore().byId("idCheckCodMaterial").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idCodMaterial"));
									}
									if (sap.ui.getCore().byId("idCheckGuia").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idGuia"));
									}
									if (inputs.length === 0) {
										sap.m.MessageToast.show("No ha seleccionado ningún filtro.");
									} else {
										jQuery.each(inputs, function (i, input) {
											if (!input.getValue()) {
												input.setValueState("Error");
												canContinue = false;
											} else {
												input.setValueState("None");
											}
										});
										if (canContinue) {
											var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();
											var aFilters = [];
											var filter = new sap.ui.model.Filter("TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
											aFilters.push(filter);
											jQuery.each(inputs, function (i, input) {
												var valor = input.getValue();
												var idCampo = input.getId();
												if (idCampo === "idFecVale") {
													filter = new sap.ui.model.Filter("BUDATI", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idNroVale") {
													if (comboKey === "N") {
														filter = new sap.ui.model.Filter("MBLNR", sap.ui.model.FilterOperator.Contains, valor);
														aFilters.push(filter);
													}
												} else if (idCampo === "idCodMaterial") {
													filter = new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idGuia") {
													filter = new sap.ui.model.Filter("MAKTX", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												}
											});

											var binding = oTableItem.getBinding("rows");
											binding.filter(aFilters, "Application");
										} else {
											var dialogMensaje = new sap.m.Dialog({
												draggable: true,
												resizable: true,
												contentWidth: "370px",
												title: "Mensaje de alerta",
												content: [
													new sap.m.Label({
														text: "Se requiere ingresar todos los campos.",
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
									}

								}.bind(this)
							}),
							new sap.m.Button({
								tooltip: "Remover los filtros",
								text: "Remover",
								icon: "sap-icon://clear-filter",
								visible: true,
								press: function () {
									var inputs = [sap.ui.getCore().byId("idFecVale"),
										sap.ui.getCore().byId("idNroVale"),
										sap.ui.getCore().byId("idCodMaterial"),
										sap.ui.getCore().byId("idGuia")
									];
									jQuery.each(inputs, function (i, input) {
										input.setValueState("None");
									});

									////////////////////////////////////////////////////////////////
									var filter1;
									var filters1 = [];
									var filters2 = [];
									var filters3 = [];
									var filters4 = [];
									var filtersT = [];
									var numeroConteo = 0;
									if (sap.ui.getCore().byId("idCheckFecVale").getSelected()) {
										filter1 = new sap.ui.model.Filter("BUDATI", sap.ui.model.FilterOperator.Contains, "");
										filters1.push(filter1);
										filtersT.push(new sap.ui.model.Filter(filters1, false));
										numeroConteo++;
									}
									if (sap.ui.getCore().byId("idCheckVale").getSelected()) {
										filter1 = new sap.ui.model.Filter("MBLNR", sap.ui.model.FilterOperator.Contains, "");
										filters2.push(filter1);
										filtersT.push(new sap.ui.model.Filter(filters2, false));
										numeroConteo++;
									}
									if (sap.ui.getCore().byId("idCheckGuia").getSelected()) {
										filter1 = new sap.ui.model.Filter("MAKTX", sap.ui.model.FilterOperator.Contains, "");
										filters3.push(filter1);
										filtersT.push(new sap.ui.model.Filter(filters3, false));
										numeroConteo++;
									}
									if (sap.ui.getCore().byId("idCheckCodMaterial").getSelected()) {
										filter1 = new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.Contains, "");
										filters4.push(filter1);
										filtersT.push(new sap.ui.model.Filter(filters4, false));
										numeroConteo++;
									}

									if (numeroConteo !== 0) {
										var list = sap.ui.getCore().byId("idTableListaTotal");
										var binding1 = list.getBinding("rows");
										binding1.filter(new sap.ui.model.Filter(filtersT, true));
									}
									sap.ui.getCore().byId("idCheckFecVale").setSelected(false);
									sap.ui.getCore().byId("idCheckVale").setSelected(false);
									sap.ui.getCore().byId("idCheckGuia").setSelected(false);
									sap.ui.getCore().byId("idCheckCodMaterial").setSelected(false);
									////////////////////////////////////////////////////////////////

									var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();
									var aFilters = [];
									var filter = new sap.ui.model.Filter("TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
									aFilters.push(filter);
									var binding = oTableItem.getBinding("rows");
									binding.filter(aFilters, "Application");
									sap.m.MessageToast.show("Se removieron los filtros.");
								}.bind(this)
							})

						]
					}),

					oTableItem,
					oTableSubTotal,
					new sap.m.Toolbar({
						width: "100%",
						height: "auto",
						content: [new sap.m.Label({
							design: "Bold",
							text: "Tabla de asignación por Documentos de Material"
						}), new sap.m.ToolbarSpacer({})]
					})
				],
				beginButton: new sap.m.Button({
					id: 'idButtonAceptar',
					text: 'Aceptar',
					type: 'Emphasized',
					icon: 'sap-icon://accept',
					press: function () {

						oModel.setProperty("/listOrdenCompraSelect", []);

						var listaValesIngreso = oModel.getProperty("/listaValesIngresoConsig");
						var vector = [];
						var vector3 = [];
						for (var v = 0; v < listaValesIngreso.length; v++) {
							if (listaValesIngreso[v].selectItem) {
								vector.push(listaValesIngreso[v]);
							} else {
								vector3.push(listaValesIngreso[v]);
							}
						}
						oModel.setProperty("/listFaltanteValesIngreso", vector3);
						this.funObtenerSelecValesIngreso(oModel.getProperty("/listTotalValesIngreso"), oModel.getProperty(
							"/listFaltanteValesIngreso"));
						oModel.setProperty(pathFacturaItem + "/clistItemsOrdenCompra", vector);
						this.subTotalOrdenCompra(vector);
						oDialogSelectItems.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					icon: "sap-icon://cancel",
					text: "Cerrar",
					press: function () {
						oDialogSelectItems.close();
					}.bind(this)
				}),
				afterClose: function () {
					oDialogSelectItems.destroy();
					oModel.setProperty("/listaValesIngresoConsig", listaValesIngresoSalvado);
				}.bind(this),
				afterOpen: function () {
					oTable.getBinding("rows").refresh(true);
					var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();

					var aFilters = [];
					var filter = new sap.ui.model.Filter("TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
					aFilters.push(filter);
					var binding = oTableItem.getBinding("rows");
					binding.filter(aFilters, "Application");
				}.bind(this)
			});
			oDialogSelectItems.addStyleClass("sapUiSizeCompact");
			/*	var oTable = new sap.m.Table("idTableItemSeleccionados", {
					minScreenWidth: "Tablet",
					hAlign: "Center",
					columns: [
						new sap.m.Column({
							header: new sap.m.Label({
								text: "Numero de Orden",
								hAlign: "Center",
								demandPopin: "true"
							})
						}),
						new sap.m.Column({
							header: new sap.m.Label({
								text: "Posición",
								hAlign: "Center",
								demandPopin: "true"
							})
						}),
						new sap.m.Column({
							header: new sap.m.Label({
								text: "Material",
								hAlign: "Center",
								demandPopin: "true"
							})
						}),
						new sap.m.Column({
							header: new sap.m.Label({
								text: "Monto",
								hAlign: "Center",
								demandPopin: "true"
							})
						}),
						new sap.m.Column({
							header: new sap.m.Label({
								text: "Disponible",
								hAlign: "Center",
								demandPopin: "true"
							})
						}),
						new sap.m.Column({
							header: new sap.m.Label({
								text: "Monto de Pedido",
								hAlign: "Center",
								demandPopin: "true"
							})
						}),
						new sap.m.Column({
							header: new sap.m.Label({
								text: "",
								hAlign: "Center",
								demandPopin: "true"
							})
						})
					],
					items: {
						path: 'myParam>/listOrdenCompraSelect',
						template: new sap.m.ColumnListItem({
							vAlign: "Middle",
							hAlign: "Center",
							selectionMode: "Single",
							cells: [
								new sap.m.Text({
									text: "{myParam>cOrdenCompraSelectNumOrden}",
									textAlign: "Center"
								}),
								new sap.m.Text({
									text: "{myParam>cOrdenCompraSelectPosicion}",
									textAlign: "Center"
								}),
								new sap.m.Text({
									text: "{myParam>cOrdenCompraSelectMaterial}",
									textAlign: "Center"
								}),
								new sap.m.Text({
									text: "{myParam>cOrdenCompraSelectMonto}",
									textAlign: "Center"
								}),
								new sap.m.Text({
									text: "{myParam>cOrdenCompraSelectDisponible}",
									textAlign: "Center"
								}),
								new sap.m.Text({
									text: "{myParam>cOrdenCompraSelectMontoPedido}",
									textAlign: "Center"
								}),
								new sap.m.Button({
									type: "Emphasized",
									icon: "sap-icon://decline",
									width: "10%",
									press: function (evt) {

										// Llamar modelo
										var oThis = this;
										var oModel = oThis.getView().getModel("myParam");

										// Obtener los datos del Item selecconados
										var oItem = evt.getSource();
										var oContext = oItem.getBindingContext("myParam");

										// Obtener el ID principal de lo seleccionado
										var vEliLaborID = oContext.getPath();
										var varId = vEliLaborID;
										var vEliLaborIDNew = varId.substring(vEliLaborID.length, vEliLaborID.length - 1);

										// Procedimiento
										var oEmployees = oModel.getProperty("/listOrdenCompraSelect");

										oEmployees.splice(vEliLaborIDNew, 1);

										// Actualizar la tabla listLabores
										oModel.setProperty("/listOrdenCompraSelect", oEmployees);

									}.bind(this)
								})
							]
						})
					}
				});
				oTable.setModel(myParam, "myParam");
				oDialogSelectItems.addContent(oTable);*/

			if (!selectedItem) {
				this.getView().byId("idComboTipo").setValueState("Error");
				var dialogMensaje = new sap.m.Dialog({
					draggable: true,
					resizable: true,
					contentWidth: "370px",
					title: "Mensaje de alerta",
					content: [
						new sap.m.Label({
							text: "Se requiere seleccionar un tipo de vale.",
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
			} else {
				this.getView().byId("idComboTipo").setValueState("None");
				oDialogSelectItems.open();
			}
		},
		changeCargaTipo: function (evt) {
			var llave = evt.getSource().getSelectedItem().getKey();
			var dialogMensaje = new sap.m.Dialog({
				draggable: true,
				resizable: true,
				contentWidth: "370px",
				title: "Mensaje de confirmación",
				content: [
					new sap.m.Label({
						text: "¿Está seguro de cambiar el tipo de carga?",
						wrapping: true,
						design: "Bold",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Los documentos de ingreso asignados a la factura serán eliminados.",
						wrapping: true,
						width: "100%"
					})
				],
				state: "Warning",
				type: "Message",
				beginButton: new sap.m.Button({
					press: function () {
						dialogMensaje.close();
						var model = this.getView().getModel("myParam");
						var listItemDetalleFactura = model.getProperty("/listItemDetalleFactura");
						for (var a = 0; a < listItemDetalleFactura.length; a++) {
							listItemDetalleFactura[a].clistItemsOrdenCompra = [];
							listItemDetalleFactura[a].clistItemDetalleFacturaEstado = "Sin Asignar";
						}
						model.setProperty("/listItemDetalleFactura", listItemDetalleFactura);
						this.verificarAsignaciónPosFactura();
						model.setProperty("/listTablaDocumentos", []);
						this.getView().byId("idValidacionDoc").setText("Se requiere asignar todos los Documentos Sustentos de la factura.");
						this.getView().byId("idValidacionDoc").setType("Warning");
						this.getView().byId("idFacturar").setEnabled(false); // poner validacion false
					}.bind(this),
					text: "Aceptar"
				}),
				endButton: new sap.m.Button({
					press: function () {
						dialogMensaje.close();
						if (llave === "N") {
							this.getView().byId("idComboTipo").setSelectedKey("N");
						}
					}.bind(this),
					text: "Cancelar"
				}),
				afterClose: function () {
					dialogMensaje.destroy();
				},

				verticalScrolling: false
			});
			dialogMensaje.open();
		},
		subTotalOrdenCompra: function (contenido) {
			var myParam = this.getView().getModel("myParam");
			var total = 0;
			var valorNeto = parseFloat(myParam.getProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaValorVenxItem")).toFixed(2);
			var valorNetoMas5 = parseFloat(valorNeto) + 1;
			valorNetoMas5 = valorNetoMas5.toFixed(2);
			var valorNetoMenos5 = parseFloat(valorNeto) - 1;
			valorNetoMenos5 = valorNetoMenos5.toFixed(2);

			for (var i = 0; i < contenido.length; i++) {
				var valorIngreso = contenido[i].WRBTR;
				if (valorIngreso === null || valorIngreso === undefined || valorIngreso === "") {
					valorIngreso = "0";
				}
				total += parseFloat(valorIngreso.toString().replace(',', ''));
			}
			total = total.toFixed(2);
			myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaTotal", total);
			myParam.setProperty("/facturaSeleccionada/0/TOTAL", total);
			if (contenido.length !== 0) {
				var totalValor = parseFloat(total);
				if (totalValor <= parseFloat(valorNetoMas5) && totalValor >= parseFloat(valorNetoMenos5)) {
					myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaEstado", "Asignado");
				} else if (totalValor > parseFloat(valorNetoMas5)) {
					myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaEstado", "Sobre-Asignado");
				} else {
					myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaEstado", "Falta Asignar");
				}

			} else {
				myParam.setProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaEstado", "Sin Asignar");
			}
			var subTotal = [];
			var llaveSub = {};
			llaveSub.total = total;
			subTotal.push(llaveSub);
			myParam.setProperty("/subTotal", subTotal);
			sap.ui.getCore().byId("idTableTotal").getBinding("rows").refresh(true);
			this.verificarAsignaciónPosFactura();
		},
		verificarAsignaciónPosFactura: function () {
			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var myParam = this.getView().getModel("myParam");
			var listaItem = myParam.getProperty("/listItemDetalleFactura");
			var asignado = true;
			for (var i = 0; i < listaItem.length; i++) {
				if (listaItem[i].clistItemDetalleFacturaEstado !== "Asignado") {
					asignado = false;
				}
			}
			if (listaItem.length !== 0) {
				var vartamtblDocOK = oModel.getProperty("/listTablaDocumentos").length;
				if (asignado) {
					this.getView().byId("idValidacionFacAsig").setText("Todos los items de la factura asignadas.");
					this.getView().byId("idValidacionFacAsig").setType("Success");
					if (this.varContValidar === 3) {
						if (vartamtblDocOK !== 0 && this.getView().byId("idValidacionDoc").getType() !== "Warning" && this.getView().byId(
								"idValidacionDoc").getType() !== "Information") { // quitar || vartamtblDocOK === 0 20200116
							this.getView().byId("idFacturar").setEnabled(true);
						} else {
							this.getView().byId("idFacturar").setEnabled(false); // poner validacion false
						}
					} else {
						if (this.varEstadoSunat1 === "X") {
							this.getView().byId("idFacturar").setEnabled(false);
						} else {
							if (vartamtblDocOK !== 0 && this.getView().byId("idValidacionDoc").getType() !== "Warning" && this.getView().byId(
									"idValidacionDoc").getType() !== "Information") { // quitar || vartamtblDocOK === 0 20200116
								this.getView().byId("idFacturar").setEnabled(true);
							} else {
								this.getView().byId("idFacturar").setEnabled(false); // poner validacion false
							}
						}
					}
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
			//////////////////////////////////////
			var varContAsig = 0;
			for (var k = 0; k < listaItem.length; k++) {
				if (listaItem[k].clistItemDetalleFacturaEstado === "Sin Asignar") {
					varContAsig++;
				}
			}
			var varSumDocMaterial = 0;
			for (var k = 0; k < listaItem.length; k++) {
				varSumDocMaterial = parseFloat(varSumDocMaterial, 10) + parseFloat(listaItem[k].clistItemDetalleFacturaTotal, 10);
			}

			var varSumPrecioSinIGV = 0;
			for (var k = 0; k < listaItem.length; k++) {
				varSumPrecioSinIGV = parseFloat(varSumPrecioSinIGV, 10) + parseFloat(listaItem[k].clistItemDetalleFacturaValorVenxItem, 10);
			}

			if (varContAsig === 0) {
				if (varSumPrecioSinIGV >= (varSumDocMaterial - 1) && varSumPrecioSinIGV <= (varSumDocMaterial + 1)) {
					this.getView().byId("idValidacionFacAsig").setText("Los Montos estan correctamente asignados.");
					this.getView().byId("idValidacionFacAsig").setType("Success");
					if (vartamtblDocOK !== 0) {
						this.getView().byId("idFacturar").setEnabled(true);
					} else {
						this.getView().byId("idFacturar").setEnabled(false); // poner validacion false
					}
				} else {
					this.getView().byId("idValidacionFacAsig").setText(
						"Los Montos no fueron asignados correctamente - fuera de la tolerancia.");
					this.getView().byId("idValidacionFacAsig").setType("Warning");
					this.getView().byId("idFacturar").setEnabled(false);
				}
			} else {
				this.getView().byId("idValidacionFacAsig").setText("Se requiere asignar todos los items de la factura.");
				this.getView().byId("idValidacionFacAsig").setType("Warning");
				this.getView().byId("idFacturar").setEnabled(false);
			}

		},
		oDialogOrdenDeCompra: function (varPosicionFactura, varCodigoFactura, varValortotalNetoFactura, varDescripcionFactura,
			pathFacturaItem) {

			// Llamar modelo
			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelxd = new sap.ui.model.odata.v2.ODataModel(url, true);
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var myParam = this.getView().getModel("myParam");
			myParam.setProperty("/listItemFiltroEnProceso", []);

			var oTable = new sap.ui.table.Table({
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				width: "38.3rem",
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
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Total"
				}),
				template: new sap.m.Text({
					text: "{TOTAL}"
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
			/*	var oTable = new sap.ui.table.Table({
					visibleRowCount: 1,
					alternateRowColors: true,
					selectionMode: "None",
					width: "30.3rem",
					rows: "{/ordenCompraSeleccionada}"
				});*/

			var oTableOCDet = new sap.ui.table.Table({
				id: "idTablaOrdenCompra",
				visibleRowCount: 5,
				alternateRowColors: true,
				selectionMode: "None",
				width: "47.3rem",
				rows: "{/listItemFiltroEnProceso}"
			});
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "3rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: ""
				}),
				template: new sap.m.CheckBox({
					selected: "{selectItem}",
					valueState: "Warning",
					select: function (evt) {
						var evento = evt.getSource().getSelected();
						var clistItemsOrdenCompra = myParam.getProperty(pathFacturaItem + "/clistItemsOrdenCompra");
						var objeto = evt.getSource().getBindingContext().getObject();
						if (evento) {
							var valorIngresar = objeto.clistItemFiltroEnProcesoValorIngresar;
							if (valorIngresar !== null && valorIngresar !== undefined && valorIngresar !== "0" && valorIngresar !== "") {
								valorIngresar = parseFloat(valorIngresar.toString());
								if (valorIngresar > 0) {
									var realizar = true;

									for (var i = 0; i < clistItemsOrdenCompra.length; i++) {
										if (this.ordenCompraGlobal === clistItemsOrdenCompra[i].ordenCompra && clistItemsOrdenCompra[i].clistItemFiltroEnProcesoPosicion ===
											objeto.clistItemFiltroEnProcesoPosicion) {

											clistItemsOrdenCompra[i].clistItemFiltroEnProcesoValorIngresar = objeto.clistItemFiltroEnProcesoValorIngresar;
											this.subTotalOrdenCompra(clistItemsOrdenCompra);
											realizar = false;
											sap.m.MessageToast.show("Se actualizó Valor Neto.");
										}
									}
									if (realizar) {
										var llave = {};
										llave = objeto;
										llave.ordenCompra = this.ordenCompraGlobal;
										clistItemsOrdenCompra.push(llave);
										this.subTotalOrdenCompra(clistItemsOrdenCompra);
										sap.m.MessageToast.show("Se agregó Item por Orden de Compra.");

									}
								} else {
									evt.getSource().setSelected(false);
									sap.m.MessageToast.show("No se permiten valores con 0 o inválidos.");
								}
							} else {
								evt.getSource().setSelected(false);
								sap.m.MessageToast.show("No se permiten valores con 0 o inválidos.");
							}

						} else {

							for (var i = 0; i < clistItemsOrdenCompra.length; i++) {
								if (this.ordenCompraGlobal === clistItemsOrdenCompra[i].ordenCompra && clistItemsOrdenCompra[i].clistItemFiltroEnProcesoPosicion ===
									objeto.clistItemFiltroEnProcesoPosicion) {
									clistItemsOrdenCompra.splice(i, 1);
									myParam.setProperty(pathFacturaItem + "/clistItemsOrdenCompra", clistItemsOrdenCompra);
									this.subTotalOrdenCompra(clistItemsOrdenCompra);
									sap.m.MessageToast.show("Se eliminó Item por Orden de Compra.");
								}
							}
						}
					}.bind(this)
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Posición"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoPosicion}"
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "13rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Descripción"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoDescripcion}"
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cantidad"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoCantidad}"
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Moneda"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoMoneda}"
				})
			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Valor Neto"
				}),
				template: new sap.m.Text({
					text: "{clistItemFiltroEnProcesoValorNeto}"
				})

			}));
			oTableOCDet.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "A Ingresar"
				}),
				template: new sap.m.Input({
					value: "{clistItemFiltroEnProcesoValorIngresar}",
					editable: true,
					liveChange: function (evt) {
						var valor1 = evt.getSource().getValue();
						var valorVerdadero = valor1;
						var valorF = evt.getSource().getBindingContext().getObject().clistItemFiltroEnProcesoValorIngresar;
						var valor2 = evt.getSource().getBindingContext().getObject().clistItemFiltroEnProcesoValorNeto;
						valor1 = parseFloat(valor1.toString());
						valor2 = parseFloat(valor2.toString());
						if (valor1 >= 0 && valor1 <= valor2) {
							evt.getSource().setValue(valorVerdadero.toString());
							var objeto = evt.getSource().getBindingContext().getObject();
							if (objeto.selectItem) {
								var clistItemsOrdenCompra = myParam.getProperty(pathFacturaItem + "/clistItemsOrdenCompra");
								for (var i = 0; i < clistItemsOrdenCompra.length; i++) {
									if (this.ordenCompraGlobal === clistItemsOrdenCompra[i].ordenCompra && clistItemsOrdenCompra[i].clistItemFiltroEnProcesoPosicion ===
										objeto.clistItemFiltroEnProcesoPosicion) {
										var valorNuevo = evt.getSource().getValue().toString();
										clistItemsOrdenCompra[i].clistItemFiltroEnProcesoValorIngresar = valorNuevo;
										this.subTotalOrdenCompra(clistItemsOrdenCompra);
										sap.m.MessageToast.show("Se actualizó Valor Neto.");
										return;
									}
								}
							}
							return;
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
								sap.m.MessageToast.show("No se permiten valores inválidos.");
								evt.getSource().setValue("");
							}

						}
					}.bind(this),
					type: "Number",
					textAlign: "Center",
					width: "100%"
				})

			}));
			oTableOCDet.setModel(myParam);

			var toolbarInfo = new sap.m.Toolbar({
				height: "auto",
				width: "100%",
				content: [
					new sap.m.SearchField({
						width: "100%"
					})
				]
			});
			toolbarInfo.addStyleClass("miClaseToolbar");
			var lista = new sap.m.List({
				id: "idListaOrdenCompra",
				includeItemInSelection: true,
				mode: "SingleSelectMaster",
				infoToolbar: toolbarInfo,
				headerText: "Ordenes de compra",
				select: function (evt) {
					sap.ui.getCore().byId("idTablaOrdenCompra").setBusy(true);
					sap.ui.getCore().byId("idCabeceraOC").setVisible(false);
					sap.ui.getCore().byId("idDetalleOC").setVisible(true);
					// Obtener los datos del Item selecconados
					var oItem = evt.getSource().getSelectedItem();
					var oContext = oItem.getBindingContext();

					var txtObject = oContext.getObject();
					this.ordenCompraGlobal = txtObject.cOrdenCompraNum;
					var itemsOrdenCompra = oModel.getProperty(pathFacturaItem + "/clistItemsOrdenCompra");
					var clistItemDetalleFacturaPosicion = oModel.getProperty(pathFacturaItem + "/clistItemDetalleFacturaPosicion");
					sap.ui.getCore().byId("idObjectListOC").setTitle("O/C Seleccionada: " + txtObject.cOrdenCompraNum);
					sap.ui.getCore().byId("idObjectListOC").setNumber(txtObject.cOrdenCompraImporte);
					sap.ui.getCore().byId("idObjectListOC").setNumberUnit(txtObject.cOrdenCompraMoneda);
					sap.ui.getCore().byId("idFechaAtributo").setText("Fecha: " + txtObject.cOrdenCompraFechaEmision);
					sap.ui.getCore().byId("idCompraIGV").setText(txtObject.cOrdenCompraIGV);
					sap.ui.getCore().byId("idStatusOC2").setText(txtObject.cOrdenCompraEstado);
					sap.ui.getCore().byId("idStatusOC1").setText(txtObject.cOrdenCompraSituacion);

					// Obtener el ID principal de lo seleccionado
					var valObject = oContext.getPath();
					var vlistOrdenCompraNum = oModel.getProperty(valObject + "/cOrdenCompraNum");
					var vlistOrdenCompraFecha = oModel.getProperty(valObject + "/cOrdenCompraFechaEmision");
					var vlistOrdenCompraImporte = oModel.getProperty(valObject + "/cOrdenCompraImporte");

					var listItemDetalleFactura = oModel.getProperty("/listItemDetalleFactura");
					//var vlistOrdenCompraMoneda = oModel.getProperty(valObject + "/cOrdenCompraMoneda");
					//var vlistOrdenCompraSituacion = oModel.getProperty(valObject + "/cOrdenCompraSituacion");
					//var vlistOrdenCompraEstado = oModel.getProperty(valObject + "/cOrdenCompraEstado");
					//var vlistOrdenCompraIGV = oModel.getProperty(valObject + "/cOrdenCompraIGV");
					var filterOrdenCompra = [];
					var filter;
					filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, vlistOrdenCompraNum);
					filterOrdenCompra.push(filter);
					//oModelxd.read("/T_OC_DETs?$format=json", {
					oModelxd.read("/" + this.varTableT_OC_DET + "?$format=json", {
						filters: filterOrdenCompra,
						success: function (response) {
							try {
								var realizar = false;
								var realizar2 = false;
								var registroEnProceso = {};
								var matrixEnProceso = [];
								var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
								var tamTabla = oModelJSON.getData().length;
								for (var i = 0; i < tamTabla; i++) {
									realizar = true;
									realizar2 = true;
									registroEnProceso = {};

									registroEnProceso.clistItemFiltroEnProcesoPosicion = oModelJSON.getData()[i].DE_POSICION;
									registroEnProceso.clistItemFiltroEnProcesoDescripcion = oModelJSON.getData()[i].DE_DESCRIPCION;
									registroEnProceso.clistItemFiltroEnProcesoCantidad = oModelJSON.getData()[i].DE_CANTIDAD;
									registroEnProceso.clistItemFiltroEnProcesoPrecio = oModelJSON.getData()[i].DE_PRECIO;
									var totalValorIngresado = 0;
									for (var f = 0; f < listItemDetalleFactura.length; f++) {
										if (clistItemDetalleFacturaPosicion !== listItemDetalleFactura[f].clistItemDetalleFacturaPosicion) {
											for (var j2 = 0; j2 < listItemDetalleFactura[f].clistItemsOrdenCompra.length; j2++) {
												var itemOrdenCompra = listItemDetalleFactura[f].clistItemsOrdenCompra;
												if (txtObject.cOrdenCompraNum === itemOrdenCompra[j2].ordenCompra && oModelJSON.getData()[i].DE_POSICION ===
													itemOrdenCompra[j2].clistItemFiltroEnProcesoPosicion) {
													var valorIngresado = itemOrdenCompra[j2].clistItemFiltroEnProcesoValorIngresar;
													totalValorIngresado += parseFloat(valorIngresado.toString());
													realizar2 = false;

												}
											}
										}

									}
									if (realizar2) {
										registroEnProceso.clistItemFiltroEnProcesoValorNeto = oModelJSON.getData()[i].DE_TOTAL;
									} else {
										var valorSubtotal = oModelJSON.getData()[i].DE_TOTAL;
										var calculo = parseFloat(valorSubtotal.toString()) - totalValorIngresado;
										registroEnProceso.clistItemFiltroEnProcesoValorNeto = calculo.toFixed(2);
									}

									for (var j = 0; j < itemsOrdenCompra.length; j++) {
										if (txtObject.cOrdenCompraNum === itemsOrdenCompra[j].ordenCompra && oModelJSON.getData()[i].DE_POSICION ===
											itemsOrdenCompra[j].clistItemFiltroEnProcesoPosicion) {
											realizar = false;
											registroEnProceso.clistItemFiltroEnProcesoValorIngresar = itemsOrdenCompra[j].clistItemFiltroEnProcesoValorIngresar;
											registroEnProceso.selectItem = true;
										}
									}
									if (realizar) {
										registroEnProceso.clistItemFiltroEnProcesoValorIngresar = "0";
										registroEnProceso.selectItem = false;
									}
									registroEnProceso.clistItemFiltroEnProcesoEstado = oModelJSON.getData()[i].DE_SITUACION1;
									registroEnProceso.clistItemFiltroEnProcesoMoneda = oModelJSON.getData()[i].DE_MONEDA;
									registroEnProceso.clistItemFiltroEnProcesoIdCrono = oModelJSON.getData()[i].DE_NUM_ARTICULO;
									registroEnProceso.clistItemFiltroEnProcesoDireccionEntrega = oModelJSON.getData()[i].DE_DIRECCION;
									registroEnProceso.clistItemFiltroEnProcesoNumMaterial = oModelJSON.getData()[i].DE_NUM_MATERIAL;
									matrixEnProceso.push(registroEnProceso);
									oModel.setProperty("/listItemFiltroEnProceso", matrixEnProceso);
									sap.ui.getCore().byId("idTablaOrdenCompra").getBinding("rows").refresh(true);
									sap.ui.getCore().byId("idTablaOrdenCompra").setBusy(false);
								}
							} catch (err) {
								sap.ui.getCore().byId("idTablaOrdenCompra").setBusy(false);
							}
						}.bind(this),
						error: function (oError) {
							oModel.setProperty("/listItemFiltroEnProceso", []);
							sap.ui.getCore().byId("idTablaOrdenCompra").setBusy(false);
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

					/*		oThis.oDiallogBusquedaItem(vlistOrdenCompraNum, vlistOrdenCompraImporte, vlistOrdenCompraFecha, varPosicionFactura,
								varCodigoFactura, varValortotalNetoFactura, varDescripcionFactura);*/
				}.bind(this),
				noDataText: "No se halló ninguna Orden de Compra"
			});
			var objeto = new sap.m.ObjectListItem({
				title: "O/C: {cOrdenCompraNum}",
				icon: "sap-icon://document-text",
				type: "Active",
				number: "{ parts:[{path:'cOrdenCompraImporte'},{path:'cOrdenCompraMoneda'}], type: 'sap.ui.model.type.Currency', formatOptions: {showMeasure: false} }",
				numberUnit: "{cOrdenCompraMoneda}",
				attributes: [
					new sap.m.ObjectAttribute({
						text: "Fecha: { path: 'cOrdenCompraFechaEmision'}"
					}),
					new sap.m.ObjectAttribute({
						title: "IGV",
						text: "{cOrdenCompraIGV}"
					})
				],
				markers: [
					new sap.m.ObjectMarker({
						visible: "{cOrdenCompraModifico}",
						type: "Flagged"
					})
				],
				firstStatus: new sap.m.ObjectStatus({
					text: "{cOrdenCompraEstado}",
					state: "None"
				}),
				secondStatus: new sap.m.ObjectStatus({
					text: "{cOrdenCompraSituacion}"
						//		state:"{ path: 'cOrdenCompraSituacion', formatter: '.formatAvailableToObjectState' }"
				})
			});
			lista.bindAggregation("items", "/listOrdenCompra", objeto);

			var hbox = new sap.m.HBox({

				justifyContent: "Center",
				width: "100%"
			});
			hbox.addItem(oTable);

			var oDialogSelectOrdenCompra = new sap.m.Dialog("idDialogOrdenCompra", {
				icon: "sap-icon://add-document",
				title: "Añadir Ordenes de Compra",
				contentWidth: "49.4rem",
				resizable: true,
				draggable: true,
				modal: true,
				type: "Message",
				content: [
					hbox,
					new sap.ui.layout.VerticalLayout({
						id: "idCabeceraOC",
						width: "100%",
						content: [
							lista
						]
					}),
					new sap.ui.layout.VerticalLayout({
						id: "idDetalleOC",
						width: "100%",
						visible: false,
						content: [
							new sap.m.ObjectListItem({
								id: "idObjectListOC",
								title: "O/C Seleccionado: {cOrdenCompraNum}",
								icon: "sap-icon://create",
								type: "Active",
								number: "{ parts:[{path:'cOrdenCompraImporte'},{path:'cOrdenCompraMoneda'}], type: 'sap.ui.model.type.Currency', formatOptions: {showMeasure: false} }",
								numberUnit: "{cOrdenCompraMoneda}",
								attributes: [
									new sap.m.ObjectAttribute({
										id: "idFechaAtributo",
										text: "Fecha: { path: 'cOrdenCompraFechaEmision'}"
									}),
									new sap.m.ObjectAttribute({
										id: "idCompraIGV",
										title: "IGV",
										text: "{cOrdenCompraIGV}"
									})
								],
								firstStatus: new sap.m.ObjectStatus({
									id: "idStatusOC2",
									text: "{cOrdenCompraEstado}",
									state: "None"
								}),
								secondStatus: new sap.m.ObjectStatus({
									id: "idStatusOC1",
									text: "{cOrdenCompraSituacion}"
										//		state:"{ path: 'cOrdenCompraSituacion', formatter: '.formatAvailableToObjectState' }"
								})
							}),
							oTableOCDet,
							new sap.m.Toolbar({
								content: [
									new sap.m.ToolbarSpacer({}),
									new sap.m.Button({
										icon: "sap-icon://navigation-left-arrow",
										text: "Regresar",
										type: "Emphasized",
										press: function () {
											lista.removeSelections(true);
											sap.ui.getCore().byId("idCabeceraOC").setVisible(true);
											sap.ui.getCore().byId("idDetalleOC").setVisible(false);
											var listOrdenCompra = oModel.getProperty("/listOrdenCompra");
											var itemsOrdenCompra = oModel.getProperty(pathFacturaItem + "/clistItemsOrdenCompra");
											var realizar = false;
											for (var i = 0; i < listOrdenCompra.length; i++) {
												realizar = true;
												for (var j = 0; j < itemsOrdenCompra.length; j++) {
													if (listOrdenCompra[i].cOrdenCompraNum === itemsOrdenCompra[j].ordenCompra) {
														realizar = false;
														listOrdenCompra[i].cOrdenCompraModifico = true;
													}
												}
												if (realizar) {
													listOrdenCompra[i].cOrdenCompraModifico = false;
												}
											}
											oModel.setProperty("/listOrdenCompra", listOrdenCompra);
											lista.getBinding("items").refresh(true);

										}.bind(this)
									})
								]
							})
						]
					}),
				],
				endButton: new sap.m.Button({
					icon: "sap-icon://cancel",
					text: "Cancelar",
					press: function () {
						var contenido = myParam.getProperty(pathFacturaItem + "/clistItemsOrdenCompra");
						for (var i = 0; i < contenido.length; i++) {
							contenido[i].clistItemFiltroEnProcesoValorIngresar = parseFloat(contenido[i].clistItemFiltroEnProcesoValorIngresar.toString())
								.toFixed(2);
						}
						myParam.setProperty(pathFacturaItem + "/clistItemsOrdenCompra", contenido);
						oDialogSelectOrdenCompra.close();
					}.bind(this)
				}),
				afterClose: function () {
					oDialogSelectOrdenCompra.destroy();
				},
				afterOpen: function () {
					var matrix = [];
					var registro = {};

					//oModelxd.read("/T_OCs?$format=json", {
					oModelxd.read("/" + this.varTableT_OC + "?$format=json", {
						success: function (response) {
							var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
							var realizar = false;
							var itemsOrdenCompra = oModel.getProperty(pathFacturaItem + "/clistItemsOrdenCompra");

							var lenghtV = oModelJSON.getData().length;
							for (var i = 0; i < lenghtV; i++) {
								registro = {};
								realizar = true;
								for (var j = 0; j < itemsOrdenCompra.length; j++) {
									if (oModelJSON.getData()[i].OC_NUMERO_ORDEN === itemsOrdenCompra[j].ordenCompra) {
										realizar = false;
										registro.cOrdenCompraModifico = true;
									}
								}
								if (realizar) {
									registro.cOrdenCompraModifico = false;
								}

								registro.cOrdenCompraNum = oModelJSON.getData()[i].OC_NUMERO_ORDEN;

								registro.cOrdenCompraEstado = oModelJSON.getData()[i].OC_ESTADO;
								registro.cOrdenCompraFechaEmision = oModelJSON.getData()[i].OC_FECHA_EMISION;
								registro.cOrdenCompraRUC = oModelJSON.getData()[i].OC_RUC;
								registro.cOrdenCompraImporte = oModelJSON.getData()[i].OC_IMPORTE_TOTAL;
								registro.cOrdenCompraIGV = oModelJSON.getData()[i].OC_IGV;
								registro.cOrdenCompraMoneda = oModelJSON.getData()[i].OC_MONEDA;
								registro.cOrdenCompraSituacion = oModelJSON.getData()[i].OC_SITUACION;
								matrix.push(registro);
							}
							oModel.setProperty("/listOrdenCompra", matrix);
							//	sap.ui.getCore().byId("idListaOrdenCompra").setHeaderText("Ordenes de Compra (" + lenghtV + ")");
							lista.setModel(oModel);
							oDialogSelectOrdenCompra.setBusy(false);
						}.bind(this),
						error: function (oError) {
							oModel.setProperty("/listOrdenCompra", []);
							sap.ui.getCore().byId("idListaOrdenCompra").setHeaderText("Ordenes de Compra (0)");
							lista.setModel(oModel);
							oDialogSelectOrdenCompra.setBusy(false);
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
			oDialogSelectOrdenCompra.setBusy(true);

			oDialogSelectOrdenCompra.open();
		},
		oDiallogBusquedaItem: function (vlistOrdenCompraNum, vlistOrdenCompraImporte, vlistOrdenCompraFecha, varPosicionFactura,
			varCodigoFactura, varValortotalNetoFactura, varDescripcionFactura) {

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var myParam = this.getView().getModel("myParam");
			var oView = oThis.getView();
			var oModelM = oView.getModel("myParam");
			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrixEnProceso = [];
			var registroEnProceso = {};

			//Filtros
			var filterOrdenCompra = [];
			var filter;
			filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, vlistOrdenCompraNum);
			filterOrdenCompra.push(filter);
			//oModelJson.read("/T_OC_DETs?$format=json", {
			oModelJson.read("/" + this.varTableT_OC_DET + "?$format=json", {
				filters: filterOrdenCompra,
				success: function (response) {
					try {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						for (var i = 0; i < tamTabla; i++) {
							registroEnProceso = {};
							registroEnProceso.clistItemFiltroEnProcesoPosicion = oModelJSON.getData()[i].DE_POSICION;
							registroEnProceso.clistItemFiltroEnProcesoDescripcion = oModelJSON.getData()[i].DE_DESCRIPCION;
							registroEnProceso.clistItemFiltroEnProcesoCantidad = oModelJSON.getData()[i].DE_CANTIDAD;
							registroEnProceso.clistItemFiltroEnProcesoPrecio = oModelJSON.getData()[i].DE_PRECIO;
							registroEnProceso.clistItemFiltroEnProcesoValorNeto = oModelJSON.getData()[i].DE_TOTAL;
							registroEnProceso.clistItemFiltroEnProcesoEstado = oModelJSON.getData()[i].DE_SITUACION1;
							registroEnProceso.clistItemFiltroEnProcesoMoneda = oModelJSON.getData()[i].DE_MONEDA;
							registroEnProceso.clistItemFiltroEnProcesoIdCrono = oModelJSON.getData()[i].DE_NUM_ARTICULO;
							registroEnProceso.clistItemFiltroEnProcesoDireccionEntrega = oModelJSON.getData()[i].DE_DIRECCION;
							registroEnProceso.clistItemFiltroEnProcesoNumMaterial = oModelJSON.getData()[i].DE_NUM_MATERIAL;
							matrixEnProceso.push(registroEnProceso);

							// Insertar y Actualizar tabla En Proceso
							sap.ui.getCore().byId("idTableOrdenCompraItems").setBusy(false);
							oModel.setProperty("/listItemFiltroEnProceso", matrixEnProceso);
							//oThis.getView().byId("idTableOrdenCompraItems").getBinding("rows").refresh(true);

						}
					} catch (err) {
					}
				}.bind(this),
				error: function (oError) {
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

			var oDialogSelectItemsOrdenCompra = new sap.m.Dialog("idDialogItemsOrdenCompra", {

				title: "Item de la Orden de Compra " + vlistOrdenCompraNum,
				contentWidth: "1200px",
				modal: true,
				type: "Message",
				content: [
					new sap.m.Label({
						text: "Posición",
						width: "10%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Label({
						text: "Código",
						width: "10%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Label({
						text: "Valor Neto",
						width: "15%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Label({
						text: "Descripción del Material",
						width: "59%"
					}),
					new sap.m.Input({
						value: varPosicionFactura,
						editable: false,
						width: "10%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Input({
						value: varCodigoFactura,
						editable: false,
						width: "10%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Input({
						value: varValortotalNetoFactura,
						editable: false,
						width: "15%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Input({
						value: varDescripcionFactura,
						editable: false,
						width: "59%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Datos de la Orden de Compra",
						width: "100%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Número de Orden de Compra",
						width: "32%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Label({
						text: "Importe Total",
						width: "32%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Label({
						text: "Fecha de Emisón",
						width: "32%"
					}),
					new sap.m.Input({
						value: vlistOrdenCompraNum,
						editable: false,
						width: "32%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Input({
						value: vlistOrdenCompraImporte,
						editable: false,
						width: "32%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "2%"
					}),
					new sap.m.Input({
						value: vlistOrdenCompraFecha,
						editable: false,
						width: "32%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "100%"
					}),
					new sap.m.Label({
						text: "  ",
						width: "100%"
					})
				],
				beginButton: new sap.m.Button({
					text: 'Seleccionar',
					type: 'Emphasized',
					icon: 'sap-icon://save',
					press: function () {

						var tableGuias = oModelM.getProperty("/listItemFiltroEnProceso");

						var vector1 = oModel.getProperty("/listOrdenCompraSelect");
						var llave1 = {};
						for (var i = 0; i < tableGuias.length; i++) {
							if (tableGuias[i].selectItem) {
								llave1 = {};
								llave1.cOrdenCompraSelectNumOrden = vlistOrdenCompraNum;
								llave1.FACTURA_POSICION = varPosicionFactura;
								llave1.FACTURA_CODIGO = varCodigoFactura;
								llave1.cOrdenCompraSelectMonto = varValortotalNetoFactura;
								llave1.FACTURA_DESCRIPCION = varDescripcionFactura;
								llave1.cOrdenCompraSelectPosicion = tableGuias[i].clistItemFiltroEnProcesoPosicion;
								llave1.cOrdenCompraSelectMaterial = tableGuias[i].clistItemFiltroEnProcesoDescripcion;
								llave1.CANTIDAD = tableGuias[i].clistItemFiltroEnProcesoCantidad;
								llave1.MONEDA = tableGuias[i].clistItemFiltroEnProcesoMoneda;
								llave1.cOrdenCompraSelectMontoPedido = tableGuias[i].clistItemFiltroEnProcesoValorNeto;
								vector1.push(llave1);
							}
						}

						oModel.setProperty("/listOrdenCompraSelect", vector1);
						//oThis.getView().byId("listOrdenCompraSelect").getBinding("rows").refresh(true);
						oDialogSelectItemsOrdenCompra.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					icon: "sap-icon://cancel",
					text: "Cancelar",
					press: function () {

						oDialogSelectItemsOrdenCompra.close();
					}.bind(this)
				}),
				afterClose: function () {
					oDialogSelectItemsOrdenCompra.destroy();
				}
			});

			var oTable = new sap.m.Table("idTableOrdenCompraItems", {
				minScreenWidth: "Tablet",
				hAlign: "Center",
				columns: [
					new sap.m.Column({
						header: new sap.m.Label({
							text: "",
							hAlign: "Center",
							demandPopin: "true"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "Posición",
							hAlign: "Center",
							demandPopin: "true"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "Descripción",
							hAlign: "Center",
							demandPopin: "true"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "Cantidad",
							hAlign: "Center",
							demandPopin: "true"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "Moneda",
							hAlign: "Center",
							demandPopin: "true"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "Valor Neto",
							hAlign: "Center",
							demandPopin: "true"
						})
					})
				],
				items: {
					path: 'myParam>/listItemFiltroEnProceso',
					template: new sap.m.ColumnListItem({
						vAlign: "Middle",
						hAlign: "Center",
						selectionMode: "None",
						cells: [
							new sap.m.CheckBox({
								selected: "{myParam>selectItem}",
								valueState: "Warning"
							}),
							new sap.m.Text({
								text: "{myParam>clistItemFiltroEnProcesoPosicion}",
								textAlign: "Center"
							}),
							new sap.m.Text({
								text: "{myParam>clistItemFiltroEnProcesoDescripcion}",
								textAlign: "Center"
							}),
							new sap.m.Text({
								text: "{myParam>clistItemFiltroEnProcesoCantidad}",
								textAlign: "Center"
							}),
							new sap.m.Text({
								text: "{myParam>clistItemFiltroEnProcesoMoneda}",
								textAlign: "Center"
							}),
							new sap.m.Input({
								value: "{myParam>clistItemFiltroEnProcesoValorNeto}",
								editable: true,
								textAlign: "Center",
								width: "100%"
							})
						]
					})
				}
			});

			sap.ui.getCore().byId("idTableOrdenCompraItems").setBusy(true);
			oTable.setModel(myParam, "myParam");
			oDialogSelectItemsOrdenCompra.addContent(oTable);

			oDialogSelectItemsOrdenCompra.open();
		},
		change: function (e) {
			sap.ui.getCore()._file = e.getParameter("files") && e.getParameter("files")[0];
			this._file = e.getParameter("files") && e.getParameter("files")[0];
		},
		btnAnadirCargarXMLTabla: function (e) {
			try {
				var oModel = this.getView().getModel("myParam");
				var varNameXML = this.getView().byId("idXML").getValue();
				var listItemDetalleFactura = oModel.getProperty("/listItemDetalleFactura");

				var view = this.getView();
				var inputs = [
					view.byId("idXML")
					//view.byId("idCodigoCentro")
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
					if (listItemDetalleFactura.length === 0) {
						this.efectuarCargaFileXML();
					} else {
						var dialogMensaje = new sap.m.Dialog({
							draggable: true,
							resizable: true,
							contentWidth: "370px",
							title: "Documento " + varNameXML,
							content: [
								new sap.m.Label({
									text: "¿Está seguro de cargar el nuevo XML?",
									wrapping: true,
									design: "Bold",
									width: "100%"
								}),
								new sap.m.Label({
									text: "El detalle de la factura al igual que su cabecera serán reemplazados.",
									wrapping: true,
									width: "100%"
								})
							],
							state: "Warning",
							type: "Message",
							beginButton: new sap.m.Button({
								press: function () {
									dialogMensaje.close();
									this.varContValidar = 0;
									this.efectuarCargaFileXML();
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
					}

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
					dialog.open();
				}

			} catch (err) {
			}
		},
		efectuarCargaFileXML: function () {
			var oModel = this.getView().getModel("myParam");
			var usuarioLogin = oModel.getProperty("/usuarioLogin");
			var usuarioRuc = oModel.getProperty("/usuarioRuc");
			var file = sap.ui.getCore()._file;
			oModel.setProperty("/listOrdenCompraSelect", []);
			oModel.setProperty("/listItemDetalleFactura", []);
			oModel.setProperty("/listErrores", []);
			oModel.setProperty("/listTablaDocumentos", []);
			this.getView().setBusy(true);
			try {
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
					this.fileGlobal = file;
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
					this.funDatosXMLInsertado();
					var reader = new FileReader();
					reader.onload = function (evn) {
						try {
							var strCSV = evn.target.result; //string in CSV 
							var oModel2 = new sap.ui.model.xml.XMLModel();
							oModel2.setXML(strCSV);
							var sunatUsuario = oModel.getProperty("/sunatUsuario");
							var sunatContrasena = oModel.getProperty("/sunatContrasena");
							var varNumFacturaValid = oModel2.getProperty("/cbc:ID");
							////////////////////////////////////////////////////////////////////////
							var filtersValDocIns = [];
							var filterValDocIns;
							filterValDocIns = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
							filtersValDocIns.push(filterValDocIns);
							filterValDocIns = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, this.varRucDeLaEmpresa);
							filtersValDocIns.push(filterValDocIns);
							filterValDocIns = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, varNumFacturaValid);
							filtersValDocIns.push(filterValDocIns);
							//var urlValDocIns = "/odatabnv/odata2.svc/";
							var urlValDocIns = "" + this.varTableURL + "/";
							var oModelValDocIns = new sap.ui.model.odata.v2.ODataModel(urlValDocIns, true);
							//oModelValDocIns.read("/T_FACs?$format=json", {
							oModelValDocIns.read("/" + this.varTableT_FAC + "?$format=json", {
								filters: filtersValDocIns,
								success: function (response) {
									var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
									var lenghtV = oModelJSON.getData().length;
									if (lenghtV === 0) { //////////////// quitar  || lenghtV !== 0

										///////////////////////////////////////////////////////////////////////////////
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
										var rucEmisor1 = oModel2.getProperty("/cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/CompanyID");
										var rucEmisor2 = oModel2.getProperty("/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification/cbc:ID");
										var rucEmisor3 = oModel2.getProperty("/cac:AccountingSupplierParty/cbc:CustomerAssignedAccountID");
										var varRUCEmisor = "";
										if (rucEmisor1.toString().trim() !== "") {
											varRUCEmisor = rucEmisor1;
										} else if (rucEmisor2.toString().trim() !== "") {
											varRUCEmisor = rucEmisor2;
										} else if (rucEmisor3.toString().trim() !== "") {
											varRUCEmisor = rucEmisor3;
										} else {
											varRUCEmisor = "";
										}
										if (varRUCEmisor.trim().toString() === usuarioLogin.trim().toString()) {

											var varCodTipoDoc = oModel2.getProperty("/cbc:InvoiceTypeCode");
											//var varCodTipoDetraccion = oModel2.getProperty("/cac:PaymentMeans/cbc:PaymentMeansCode");
											var varCodTipoDetraccion = oModel2.getProperty("/cac:PaymentTerms/cbc:PaymentMeansID");
											if (varCodTipoDetraccion !== "") {
												//varCodTipoDetraccion = oModel2.getProperty("/cac:PaymentMeans/cbc:PaymentMeansCode");
												varCodTipoDetraccion = oModel2.getProperty("/cac:PaymentTerms/cbc:PaymentMeansID");
												var varTamCodigoDetr = oModel.getProperty("/codigoDetr").length;
												for (var k = 0; k < varTamCodigoDetr; k++) {
													if (parseInt(oModel.getProperty("/codigoDetr/" + k + "/codigo"), 10) === parseInt(varCodTipoDetraccion, 10)) {
														var comboDetra = this.getView().byId("idCodigoDetra");
														comboDetra.getBinding("items").refresh(true);
														var firstItem = comboDetra.getItems()[k];
														comboDetra.setSelectedItem(firstItem, true);
													}
												}
											} else {
												varCodTipoDetraccion = "-----";
												var comboDetra = this.getView().byId("idCodigoDetra");
												comboDetra.getBinding("items").refresh(true);
												var firstItem = comboDetra.getItems()[0];
												comboDetra.setSelectedItem(firstItem, true);
											}
											var rucReceptor1 = oModel2.getProperty("/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/CompanyID");
											var rucReceptor2 = oModel2.getProperty("/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID");
											var rucReceptor3 = oModel2.getProperty("/cac:AccountingCustomerParty/cbc:CustomerAssignedAccountID");
											var varRUCReceptor = "";
											if (rucReceptor1.toString().trim() !== "") {
												varRUCReceptor = rucReceptor1;
											} else if (rucReceptor2.toString().trim() !== "") {
												varRUCReceptor = rucReceptor2;
											} else if (rucReceptor3.toString().trim() !== "") {
												varRUCReceptor = rucReceptor3;
											} else {
												varRUCReceptor = "";
											}

											if (varRUCReceptor === usuarioRuc) {
												var recRazonSocial1 = oModel2.getProperty(
													"/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cbc:RegistrationName");
												var recRazonSocial2 = oModel2.getProperty(
													"/cac:AccountingCustomerParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName");
												var varRecRazonSocial = "";
												if (recRazonSocial1.toString().trim() !== "") {
													varRecRazonSocial = recRazonSocial1;
												} else if (recRazonSocial2.toString().trim() !== "") {
													varRecRazonSocial = recRazonSocial2;
												} else {
													varRecRazonSocial = "";
												}

												var varMoneda = oModel2.getProperty("/cbc:DocumentCurrencyCode");

												//////////////////////////////////////////////////////////////////////////7
												var varCabeTotalImporte = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:PayableAmount");
												var varCabeTotalIGV = oModel2.getProperty("/cac:TaxTotal/cbc:TaxAmount");
												var varCabeTotalSinIGV = parseFloat(varCabeTotalImporte, 10) - parseFloat(varCabeTotalIGV, 10);
												var varCabePorcentajeIGV = (parseFloat(varCabeTotalImporte, 10) / parseFloat(varCabeTotalSinIGV, 10) - 1) * 100;
												varCabePorcentajeIGV = varCabePorcentajeIGV.toFixed(0);
												if (isNaN(varCabePorcentajeIGV)) {
													varCabePorcentajeIGV = 0;
												}
												//////////////////////////////////////////////////////////////////////////7

												//var varIGV = "18%";
												var varIGV = varCabePorcentajeIGV + "%";

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
												llaveCabeceraFacLabel[10] = "Tipo de detracción";

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
												llaveCabeceraFacValue[10] = varCodTipoDetraccion;

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
												var realizar = true;
												var texto = "";
												var textoVariable = "";
												var InvoiceLine = oModel2.getProperty("/cac:InvoiceLine");
												var CreditNoteLine = oModel2.getProperty("/cac:CreditNoteLine");
												if (InvoiceLine.toString().trim() !== "") {
													texto = "/cac:InvoiceLine";
													textoVariable = "/cbc:InvoicedQuantity";
												} else if (CreditNoteLine.toString().trim() !== "") {
													texto = "/cac:CreditNoteLine";
													textoVariable = "/cbc:CreditedQuantity";
												} else {
													realizar = false;
												}

												if (realizar) {
													while (cont === 1) {
														try {
															oModel2.getProperty(texto + "/" + tamDetalleFactura + "/cbc:ID");
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
													var varValorPorcentajeIGV = [];

													var llaveDetalle = {};
													var valor1Codigo = "";
													var valor2Codigo = "";
													var descripcionTotal = "";
													var var1PorcentajeVal = "";
													var var2PorcentajeVal = "";
													for (var j = 0; j < tamDetalleFactura; j++) {
														llaveDetalle = {};

														varPosicion[j] = oModel2.getProperty(texto + "/" + j + "/cbc:ID");

														valor1Codigo = oModel2.getProperty(texto + "/" + j + "/cac:Item/cac:SellersItemIdentification/cbc:ID");
														valor2Codigo = oModel2.getProperty(texto + "/" + j + "/cac:Item/cac:AdditionalItemProperty/cbc:Value");
														if (valor1Codigo.toString().trim() !== "") {
															varCodigo[j] = valor1Codigo;
														} else if (valor2Codigo.toString().trim() !== "") {
															varCodigo[j] = valor2Codigo;
														} else {
															varCodigo[j] = "";
														}

														varDescripcion[j] = oModel2.getProperty(texto + "/" + j + "/cac:Item/cbc:Description");
														descripcionTotal = oModel2.getProperty(texto + "/" + j + "/cac:Item/cac:AdditionalItemProperty/cbc:Name");
														if (descripcionTotal.toString().trim() !== "") {
															varDescripcion[j] = varDescripcion[j] + " - " + descripcionTotal;
														}

														varUnidMedida[j] = oModel2.getProperty(texto + "/" + j + textoVariable + "/@unitCode");
														varCantidad[j] = oModel2.getProperty(texto + "/" + j + textoVariable);
														varAfectacionIGV[j] = oModel2.getProperty(texto + "/" + j +
															"/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:Name");
														varPrecioUnitxItem[j] = oModel2.getProperty(texto + "/" + j + "/cac:Price/cbc:PriceAmount");
														varPrecioVentaxItem[j] = oModel2.getProperty(texto + "/" + j +
															"/cac:PricingReference/cac:AlternativeConditionPrice/cbc:PriceAmount");
														varTotalIGVxItem[j] = oModel2.getProperty(texto + "/" + j + "/cac:TaxTotal/cbc:TaxAmount");
														varValorVentaxItem[j] = oModel2.getProperty(texto + "/" + j + "/cbc:LineExtensionAmount");
														varValortotalNetoXItem[j] = parseFloat(varTotalIGVxItem[j], 10) + parseFloat(varValorVentaxItem[j], 10);

														var1PorcentajeVal = oModel2.getProperty(texto + "/" + j + "/cac:TaxTotal/cac:TaxSubtotal/cbc:Percent");
														var2PorcentajeVal = oModel2.getProperty(texto + "/" + j +
															"/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cbc:Percent");
														if (var1PorcentajeVal.toString().trim() !== "") {
															varValorPorcentajeIGV[j] = var1PorcentajeVal;
														} else if (var2PorcentajeVal.toString().trim() !== "") {
															varValorPorcentajeIGV[j] = var2PorcentajeVal;
														} else {
															varValorPorcentajeIGV[j] = "0.00";
														}
														llaveDetalle.clistItemDetalleFacturaPosicion = varPosicion[j]; //clistItemDetalleFacturaValortotalNetoXItem clistItemDetalleFacturaValorVenxItem
														llaveDetalle.clistItemDetalleFacturaEstado = "Sin Asignar";
														llaveDetalle.clistItemDetalleFacturaCodigo = varCodigo[j];
														llaveDetalle.clistItemDetalleFacturaDescripcion = varDescripcion[j].substring(0, 99);
														llaveDetalle.clistItemDetalleFacturaUniMedida = varUnidMedida[j];
														llaveDetalle.clistItemDetalleFacturaMoneda = varMoneda;
														llaveDetalle.clistItemDetalleFacturaCantidad = parseFloat(varCantidad[j]).toFixed(2);
														llaveDetalle.clistItemDetalleFacturaAfectacionIGV = varAfectacionIGV[j];
														llaveDetalle.clistItemDetalleFacturaPreUnixItem = varPrecioUnitxItem[j];
														llaveDetalle.clistItemDetalleFacturaPreVenxItem = varPrecioVentaxItem[j];
														llaveDetalle.clistItemDetalleFacturaTotIGVxItem = varTotalIGVxItem[j];
														llaveDetalle.clistItemDetalleFacturaValorVenxItem = parseFloat(varValorVentaxItem[j]).toFixed(2);
														llaveDetalle.clistItemDetalleFacturaTotal = "0";
														//var obValconIGV = parseFloat(varValorVentaxItem[j]) * 1.18;
														var obValconIGV = parseFloat(varValorVentaxItem[j]) * (parseFloat(varValorPorcentajeIGV[j], 10) / 100 + 1);
														llaveDetalle.clistItemDetalleFacturaValortotalNetoXItem = obValconIGV.toFixed(2);
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

													sap.m.MessageToast.show("Se realizó la carga XML.");
													this.validarSunat();
													this.verificarAsignaciónPosFactura();

													// Validar Documentos Adjuntos
													var varTblTam = oModel.getProperty("/listTablaDocumentos").length;
													if (varTblTam === 0) {
														this.getView().byId("idValidacionDoc").setText("Se requiere asignar todos los Documentos Sustentos de la factura.");
														this.getView().byId("idValidacionDoc").setType("Warning");
													}

													this.getView().byId("idAnadirDocSus").setEnabled(true);

												} else {
													sap.m.MessageToast.show("No se pudo realizar la carga de los items del XML.");
												}
											} else {
												var dialog = new sap.m.Dialog({
													//title: varRUCReceptor + " - " + usuarioRuc,
													title: "Error",
													type: "Message",
													state: "Error",
													content: new sap.m.Text({
														//text: "El número de RUC no corresponde con el del RUC de la empresa."
														text: "El número de RUC " + varRUCReceptor +
															" de la empresa que indica la factura no corresponde con el número de RUC " +
															usuarioRuc + " de la empresa elegida a facturar."

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
												//title: varRUCEmisor + " - " + usuarioLogin,
												title: "Error",
												type: "Message",
												state: "Error",
												content: new sap.m.Text({

													//text: "El número de RUC del usuario no corresponde con el del RUC del proveedor."
													text: "El número de RUC " + varRUCEmisor +
														" del proveedor que indica la factura no corresponde con su número de RUC " +
														usuarioLogin + "."
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
										///////////////////////////////////////////////////////////////////////////////

									} else {
										this.getView().setBusy(false);
										var dialogValDocIns = new sap.m.Dialog({
											title: "Error factura",
											type: "Message",
											state: "Error",
											icon: "sap-icon://error",
											content: new sap.m.Text({
												text: "La factura " + varNumFacturaValid + " que se intenta ingresar ya ha sido registrada."
											}),
											beginButton: new sap.m.Button({
												text: "Aceptar",
												press: function () {
													dialogValDocIns.close();
													dialogValDocIns.destroy();
												}
											}),
											afterClose: function () {
												dialogValDocIns.destroy();
											}
										});
										dialogValDocIns.open();
									}
								}.bind(this),
								error: function (oError) {
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
							////////////////////////////////////////////////////////////////////////

						} catch (err) {
							oModel.setProperty("/listItemDetalleFactura", []);
							this.verificarAsignaciónPosFactura();

						}
					}.bind(this);
					reader.readAsText(file);
					this.getView().setBusy(false);
				} else {
					this.getView().setBusy(false);
				}
			} catch (err) {
				this.getView().setBusy(false);
			}
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
		btnInicio: function () {
			var oModel = this.getView().getModel("myParam");
			var listItemDetalleFactura = oModel.getProperty("/listItemDetalleFactura");
			if (listItemDetalleFactura.length === 0) {
				this.getRouter().navTo("Vista_Menu_Principal");
			} else {
				var dialogMensaje = new sap.m.Dialog({
					draggable: true,
					resizable: true,
					contentWidth: "370px",
					title: "Mensaje de confirmación",
					content: [
						new sap.m.Label({
							text: "¿Está seguro de volver al menú de inicio?",
							wrapping: true,
							design: "Bold",
							width: "100%"
						}),
						new sap.m.Label({
							text: "El detalle de la factura al igual que su cabecera serán eliminados.",
							wrapping: true,
							width: "100%"
						})
					],
					state: "Warning",
					type: "Message",
					beginButton: new sap.m.Button({
						press: function () {
							dialogMensaje.close();
							this.varContValidar = 0;
							this.getRouter().navTo("Vista_Menu_Principal");
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
			}
		},
		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
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
					},
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

		btnFacturarMesage: function () {

			var itemComboboxRetrac = this.getView().byId("idCodigoDetra").getSelectedItem().getKey();

			/// 20200608
			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");

			var varTamListCabecera = 0;
			var varTamListDetalleFact = 0;
			var varTamListDetallePos = 0;
			var varTamListDocumentos = 0;

			var vectorCabeceraFactura = oModel.getProperty("/listItemCabeceraFactura");
			if (vectorCabeceraFactura.length > 1) {
				varTamListCabecera = 1;
			}
			var vectorDetalleFactura = oModel.getProperty("/listItemDetalleFactura");
			for (var i = 0; i < vectorDetalleFactura.length; i++) {
				varTamListDetalleFact++;
				var itemsOC = vectorDetalleFactura[i].clistItemsOrdenCompra;
				for (var j = 0; j < itemsOC.length; j++) {
					varTamListDetallePos++;
				}
			}
			var vectorTablaDocumentos = oModel.getProperty("/listTablaDocumentos");
			for (var i = 0; i < vectorTablaDocumentos.length; i++) {
				varTamListDocumentos++;
			}
			varTamListDocumentos = 2 * parseInt(varTamListDocumentos, 10);

			var varTotal = varTamListCabecera + varTamListDetalleFact + varTamListDetallePos + varTamListDocumentos;
			this.varTotalInsert = varTotal;
			/// 20200608	

			var textDecision = null;
			if (itemComboboxRetrac === "NA") {
				textDecision = "NO";
			} else {
				textDecision = "SI";
			}

			var dialog = new sap.m.Dialog({
				title: 'Mensage',
				contentWidth: "600px",
				type: 'Message',
				state: 'Success',
				content: [
					//text: 'Factura ' + textDecision + ' está afecta a detracción. ¿Está seguro que desea realizar el registro?   '
					new sap.m.Label({
						text: "Factura ",
						wrapping: true,
						width: "10%"
					}),
					new sap.m.Label({
						text: textDecision,
						wrapping: true,
						design: "Bold",
						width: "5%"
					}),
					new sap.m.Label({
						text: " está afecta a detracción. ¿Está seguro que desea realizar el registro?",
						wrapping: true,
						width: "85%"
					}),
				],
				beginButton: new sap.m.Button({
					text: 'OK',
					type: 'Emphasized',
					press: function () {
						dialog.close();
						this.btnFacturar();
						this.getView().setBusy(true);
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					type: 'Emphasized',
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

		btnFacturar: function () {
			this.varTotalInsertEje = 0;
			this.varTotalInsertEjeError = 0;
			this.varTotalInsertEjeErrorVal = false;
			var itemSeleccionado = this.getView().byId("idComboTipo").getSelectedItem();

			if (itemSeleccionado !== null && itemSeleccionado !== undefined) {
				this.getView().setBusy(true);

				//var url = "/odatabnv/odata2.svc/";
				var url = "" + this.varTableURL + "/";
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

				var oView22 = this.getView();
				var oModel22 = oView22.getModel("myParam");
				oView22.setModel(oModel22);

				var usuarioLogin = oModel22.getProperty("/usuarioLogin");

				var model = this.getView().getModel("myParam");
				model.setProperty("/listErrores", []);
				var paginaCard = model.getProperty("/pages/0");
				filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, this.varRucDeLaEmpresa);
				filters.push(filter);
				filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
				filters.push(filter);
				filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, paginaCard.description);
				filters.push(filter);

				var varContNumErrores = true;
				//oModel.read("/T_FACs?$format=json", {
				oModel.read("/" + this.varTableT_FAC + "?$format=json", {
					filters: filters,
					success: function (response) {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var lenghtV = oModelJSON.getData().length;
						if (lenghtV === 0) {
							// var oFileUploader = this.getView().byId("idXML");
							// var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
							/*var file = this.fileGlobal;
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
							$.ajax('/DOCUMENT/6d47b482a30ca504bfdf66d5/root', {
								method: 'POST',
								data: formData,
								cache: false,
								processData: false,
								contentType: false,
								success: function (response) {
									this.obtenerExitoOdata("Factura " + fileName, "Se guardó con éxito el archivo " + fileName + ".");
								}.bind(this),
								error: function (data) {
									/*this.obtenerErrorOdata(data, "Error al registrar en el Document Service", "No se pudo guardar el archivo" + fileName +
										".");*/
							/*}.bind(this)
							});*/

							var cabecera = model.getProperty("/listItemCabeceraFactura");
							var usuario = model.getProperty("/usuarioLogin");
							var rucUser = model.getProperty("/usuarioRuc");
							//var varKeyCentro = this.getView().byId("idCodigoCentro").getSelectedItem().getKey();

							var SOHeader = {};
							SOHeader.EM_RUC = this.varRucDeLaEmpresa;
							SOHeader.US_RUC = usuario;
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
							SOHeader.TIPO_CARGA = itemSeleccionado.getKey();
							SOHeader.TIPO_OPERACION = "";
							SOHeader.CODIGO_CONCENTRACION = this.getView().byId("idCodigoDetra").getSelectedItem().getKey();
							SOHeader.FC_HORA_REGISTRO = time;
							//SOHeader.FC_FEC_REGISTRO = "";
							//SOHeader.FC_HORA_REGISTRO = "";
							SOHeader.FC_USER_REGISTRO = usuario;
							SOHeader.ESTADO = "E";
							SOHeader.FEC_JOB = "";
							//oModel.create("/T_FACs", SOHeader, {
							oModel.create("/" + this.varTableT_FAC + "", SOHeader, {
								method: "POST",
								success: function (data) {
									this.varTotalInsertEje++; // 20200608
									this.funValidarEstadoInsert(this.varRucDeLaEmpresa, usuarioLogin, paginaCard.description, date, time);
									this.obtenerExitoOdata("Factura " + data.ID_FACTURA, "Se registró con éxito la factura " + data.ID_FACTURA + ".");
									var listItemDetalleFactura = model.getProperty("/listItemDetalleFactura");
									var llavePos = {};
									var llaveItem = {};
									for (var a = 0; a < listItemDetalleFactura.length; a++) {
										llavePos = {};
										llavePos.EM_RUC = this.varRucDeLaEmpresa;
										llavePos.US_RUC = usuario;
										llavePos.ID_FACTURA = paginaCard.description;
										llavePos.POS_FACTURA = listItemDetalleFactura[a].clistItemDetalleFacturaPosicion;
										llavePos.PRECIO_NETO = listItemDetalleFactura[a].clistItemDetalleFacturaValortotalNetoXItem;
										llavePos.CODIGO = listItemDetalleFactura[a].clistItemDetalleFacturaCodigo;
										llavePos.DESCRIPCION = listItemDetalleFactura[a].clistItemDetalleFacturaDescripcion;
										llavePos.UND_MED = listItemDetalleFactura[a].clistItemDetalleFacturaUniMedida;

										//llavePos.CANTIDAD = parseInt(listItemDetalleFactura[a].clistItemDetalleFacturaCantidad).toString();
										llavePos.CANTIDAD = parseFloat(listItemDetalleFactura[a].clistItemDetalleFacturaCantidad).toFixed(2);
										llavePos.PRE_UNI = parseFloat(listItemDetalleFactura[a].clistItemDetalleFacturaPreUnixItem).toFixed(2);
										llavePos.PRE_VENTA = parseFloat(listItemDetalleFactura[a].clistItemDetalleFacturaPreVenxItem).toFixed(2);
										var itemsOC = listItemDetalleFactura[a].clistItemsOrdenCompra;
										for (var b = 0; b < itemsOC.length; b++) {
											llaveItem = {};
											llaveItem.ID_FACTURA = paginaCard.description;
											llaveItem.POS_FACTURA = listItemDetalleFactura[a].clistItemDetalleFacturaPosicion;
											llaveItem.EM_RUC = this.varRucDeLaEmpresa;
											llaveItem.US_RUC = usuario;
											llaveItem.DE_POSICION = (b + 1).toString();
											llaveItem.VALE = itemsOC[b].MJAHR;
											llaveItem.VALE_NUM = itemsOC[b].WERKS;
											//llaveItem.DE_DOC_MATERIAL = itemsOC[b].MBLNR;
											if (itemsOC[b].MBLNR !== "" && itemsOC[b].MBLNR !== null && itemsOC[b].MBLNR !== undefined) {
												llaveItem.DE_DOC_MATERIAL = itemsOC[b].MBLNR;
											} else {
												llaveItem.DE_DOC_MATERIAL = "";
											}
											//llaveItem.DE_POS_DOC_MATERIAL = itemsOC[b].ZEILE;
											if (itemsOC[b].ZEILE !== "" && itemsOC[b].ZEILE !== null && itemsOC[b].ZEILE !== undefined) {
												llaveItem.DE_POS_DOC_MATERIAL = itemsOC[b].ZEILE;
											} else {
												llaveItem.DE_POS_DOC_MATERIAL = "";
											}
											//llaveItem.OC_NUMERO_ORDEN = itemsOC[b].BUDATI;
											if (itemsOC[b].BUDATI !== "" && itemsOC[b].BUDATI !== null && itemsOC[b].BUDATI !== undefined) {
												llaveItem.OC_NUMERO_ORDEN = itemsOC[b].BUDATI;
											} else {
												llaveItem.OC_NUMERO_ORDEN = "";
											}
											//llaveItem.DE_HOJA_ENTRADA = itemsOC[b].BUDATF;
											if (itemsOC[b].BUDATF !== "" && itemsOC[b].BUDATF !== null && itemsOC[b].BUDATF !== undefined) {
												llaveItem.DE_HOJA_ENTRADA = itemsOC[b].BUDATF;
											} else {
												llaveItem.DE_HOJA_ENTRADA = "";
											}
											llaveItem.FEC_VALE = itemsOC[b].BLDAT;
											llaveItem.PRECIO_ING = parseFloat(itemsOC[b].WRBTR.toString().replace(',', ''), 10).toString();
											llaveItem.UND_MED = itemsOC[b].BWAER;
											llaveItem.CODIGO = itemsOC[b].MATNR;
											llaveItem.DESCRIPCION = itemsOC[b].MAKTX;
											//llaveItem.CANTIDAD = parseFloat(itemsOC[b].BSTMG).toFixed(2);
											llaveItem.CANTIDAD = parseFloat(itemsOC[b].BSTMG.trim().toString().replace(',', '')).toFixed(2);
											//llaveItem.GUIA_REMISION = itemsOC[b].BSTME;
											if (itemsOC[b].BSTME !== "" && itemsOC[b].BSTME !== null && itemsOC[b].BSTME !== undefined) {
												llaveItem.GUIA_REMISION = itemsOC[b].BSTME;
											} else {
												llaveItem.GUIA_REMISION = "";
											}
											llaveItem.PRE_UNI = "";
											llaveItem.PRE_VENTA = "";

											//oModel.create("/T_FAC_POSs", llaveItem, {
											oModel.create("/" + this.varTableT_FAC_POS + "", llaveItem, {
												method: "POST",
												success: function (data) {
													this.varTotalInsertEje++; // 20200608
													this.funValidarEstadoInsert(this.varRucDeLaEmpresa, usuarioLogin, paginaCard.description, date, time);
													var llaveActualizar = {};
													llaveActualizar.FLAC = "x";
													//var texto = "/T_CON_DETs(EM_RUC='" + data.EM_RUC + "',US_RUC='" + data.US_RUC +
													var texto = "/" + this.varTableT_CON_DET + "(EM_RUC='" + this.varRucDeLaEmpresa + "',US_RUC='" + data.US_RUC +
														"',WERKS='" + data.VALE_NUM + "',MBLNR='" + data.DE_DOC_MATERIAL + "',MJAHR='" + data.VALE +
														"',ZEILE='" + data.DE_POS_DOC_MATERIAL + "')";
													oModel.update(texto, llaveActualizar, {
														method: "PUT",
														success: function (data) {
														},
														error: function (data) {
														}
													});
													this.obtenerExitoOdata("Factura " + data.ID_FACTURA + ", posición " + data.DE_POSICION + ", OC " + data.OC_NUMERO_ORDEN,
														"Se registró con éxito la posición OC" + data.DE_POSICION + " - " + data.OC_NUMERO_ORDEN + " .");
												}.bind(this),
												error: function (data) {
													varContNumErrores = false;
													this.varTotalInsertEjeError++;
													this.obtenerErrorOdata(data, "Error al registrar en T_FAC_POS",
														"No se pudo registrar una posición OC de la factura " + paginaCard.description + ".");
												}.bind(this)
											});
										}
										//oModel.create("/T_FAC_DETs", llavePos, {
										oModel.create("/" + this.varTableT_FAC_DET + "", llavePos, {
											method: "POST",
											success: function (data) {
												this.varTotalInsertEje++; // 20200608
												this.funValidarEstadoInsert(this.varRucDeLaEmpresa, usuarioLogin, paginaCard.description, date, time);
												this.obtenerExitoOdata("Factura " + data.ID_FACTURA + ", item " + data.POS_FACTURA,
													"Se registró con éxito el item de la factura " + data.POS_FACTURA + " - " + data.ID_FACTURA + " .");
											}.bind(this),
											error: function (data) {
												varContNumErrores = false;
												this.varTotalInsertEjeError++;
												this.obtenerErrorOdata(data, "Error al registrar en T_FAC_DET", "No se pudo registrar un item de la factura " +
													paginaCard.description + ".");
											}.bind(this)
										});
									}

									/////////////////////////// Documentos ////////////////////////////
									// Llamar modelo
									var oThis = this;
									var oModelDoc = oThis.getView().getModel("myParam");
									var varTabla = oModelDoc.getProperty("/listTablaDocumentos");
									var llaveDocumento = {};
									for (var i = 0; i < varTabla.length; i++) {
										var varDocItemNombre = varTabla[i].clistTabDocuNombreArch;
										var varDocItemArchivo = varTabla[i].clistTabDocuArchivo;
										// Tabla T_DOC
										llaveDocumento = {};
										llaveDocumento.EM_RUC = this.varRucDeLaEmpresa;
										llaveDocumento.US_RUC = usuario;
										llaveDocumento.ID_FACTURA = paginaCard.description;
										llaveDocumento.POS_DOCUMENTO = i.toString();
										llaveDocumento.NOMBRE_DOC = varTabla[i].clistTabDocuNombreArch;
										llaveDocumento.TAMANO = parseFloat(varTabla[i].clistTabDocuTamanoNum, 10).toFixed(2);
										var fileName = varTabla[i].clistTabDocuNombreArch.split(".");
										if (fileName.length === 1) {
											llaveDocumento.FORMATO = null;
										} else {
											llaveDocumento.FORMATO = fileName[fileName.length - 1];
										}
										llaveDocumento.FECHA_DOC = varTabla[i].clistTabDocuFecha;
										llaveDocumento.HORA_DOC = varTabla[i].clistTabDocuHora;
										llaveDocumento.FECHA_ADJ = date;
										llaveDocumento.HORA_ADJ = time;
										llaveDocumento.USUARIO = "";
										//llaveDocumento.DOCUMENTO = varTabla[i].clistTabBinario.substring(0, 4999998);
										//llaveDocumento.DOCUMENTO = "";
										this.funSubriDocumento(varDocItemArchivo, varDocItemNombre, llaveDocumento, date, time);
									}
									///////////////////////////////////////////////////////////////////

									//this.getView().setBusy(false);
								}.bind(this),
								error: function (data) {
									varContNumErrores = false;
									this.varTotalInsertEjeError++;
									this.obtenerErrorOdata(data, "Error al registrar en T_FAC", "No se pudo registrar la factura " + paginaCard.description +
										".");
									//this.getView().setBusy(false);
								}.bind(this)
							});
							this.getView().byId("idErrores").setVisible(true);
							//this.btnErrores();
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
						varContNumErrores = false;
						/*var dialog = new sap.m.Dialog({
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
						dialog.open();*/
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
				if (varContNumErrores) {
					//this.getRouter().navTo("Vista_Menu_Principal");
				}
			} else {
				sap.m.MessageToast.show("Se requiere seleccionar el tipo de carga .");
			}

		},

		funSubriDocumento: function (archivo, nombre, llave, date, time) {

			var file = archivo;
			//var fileName = nombre.description + ".xml";
			var data = {
				'propertyId[0]': 'cmis:objectTypeId',
				'propertyValue[0]': 'cmis:document',
				'propertyId[1]': 'cmis:name',
				'propertyValue[1]': nombre,
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
					this.varTotalInsertEje++; // 20200608
					this.funValidarEstadoInsert(llave.EM_RUC, llave.US_RUC, llave.ID_FACTURA, date, time);
					//var url = "/odatabnv/odata2.svc/";
					var url = "" + this.varTableURL + "/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);

					//oModel.create("/T_DOCs", llave, {
					oModel.create("/" + this.varTableT_DOC + "", llave, {
						method: "POST",
						success: function (data) {
							this.varTotalInsertEje++; // 20200608
							this.funValidarEstadoInsert(llave.EM_RUC, llave.US_RUC, llave.ID_FACTURA, date, time);
						}.bind(this),
						error: function (data) {
							this.varTotalInsertEjeError++;
						}.bind(this)
					});
					//this.obtenerExitoOdata("Factura " + fileName, "Se guardó con éxito el archivo " + fileName + ".");
				}.bind(this),
				error: function (data) {
					this.varTotalInsertEjeError++;
					//this.obtenerErrorOdata(data, "Error al registrar en el Document Service", "No se pudo guardar el archivo" + fileName + ".");
				}.bind(this)
			});
		},

		funValidarEstadoInsert: function (EM_RUC, US_RUC, ID_FACTURA, date, time) {

			if (this.varTotalInsert === this.varTotalInsertEje) {
				var url = "" + this.varTableURL + "/";
				this.getView().setBusy(false);
				this.getRouter().navTo("Vista_Menu_Principal");
				var oModelOdata = new sap.ui.model.odata.v2.ODataModel(url, true);

				var llaveActualizar = {};
				//llaveActualizar.FC_FEC_REGISTRO = date;
				//llaveActualizar.FC_HORA_REGISTRO = time;
				llaveActualizar.ESTADO = "P";
				var texto = "/" + this.varTableT_FAC + "(EM_RUC='" + EM_RUC + "',US_RUC='" + US_RUC + "',ID_FACTURA='" + ID_FACTURA + "')";
				oModelOdata.update(texto, llaveActualizar, {
					method: "PUT",
					success: function (data) {
						var dialog = new sap.m.Dialog({
							title: "Mensaje de Exito",
							type: "Message",
							state: "Success",
							icon: "sap-icon://accept",
							content: new sap.m.Text({
								text: "Se registró correctamente la factura " + ID_FACTURA + " para el usuario " + US_RUC + "."
							}),
							beginButton: new sap.m.Button({
								text: "Aceptar",
								press: function () {
									dialog.close();
									dialog.destroy();
								}.bind(this)
							}),
							afterClose: function () {
								dialog.destroy();
							}
						});
						dialog.open();
					},
					error: function (data) {
					}
				});
			}
			if (this.varTotalInsertEjeError > 0 && this.varTotalInsertEjeErrorVal === false) {

				this.varTotalInsertEjeErrorVal = true;

				var dialog = new sap.m.Dialog({
					title: "Mensaje de Error",
					type: "Message",
					state: "Error",
					icon: "sap-icon://accept",
					content: new sap.m.Text({
						text: "La factura no fué cargada correctamente, por favor eliminar y volver a intentar."
					}),
					beginButton: new sap.m.Button({
						text: "Aceptar",
						press: function () {
							this.getView().setBusy(false);
							this.getRouter().navTo("Vista_Menu_Principal");
							dialog.close();
							dialog.destroy();
						}.bind(this)
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();
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
						this.varEstadoSunat1 = oModelJSON.getData()[0].ESTADO;
					}
				}.bind(this),
				error: function (oError) {
				}.bind(this)
			});
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
					if (this.varEstadoSunat1 === "X") {
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
								this.varContValidar = 0;  // MAURO 20211014

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
									this.varContValidar++;
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
									this.varContValidar++;
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
									this.getView().byId("idValidacionFacySunat2").setText(
										"Estado del contribuyente a la fecha de emisión : BAJA DE OFICIO.");
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
									this.varContValidar++;
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
							error: function (response) {
								try {

									var cabecera = "";
									var cuerpo = "";
									try {
										var responseText = response.responseText;
										var parser = new DOMParser();
										var xmlDoc = parser.parseFromString(responseText, "text/xml");
										var message = xmlDoc.getElementsByTagName("error")[0].textContent;
										cabecera = "(" + response.statusCode + ") " + response.statusText;
										cuerpo = message;
									} catch (err) {
										try {
											responseText = response.responseText;
											var jsonFormat = JSON.parse(responseText);
											cabecera = "(" + response.statusCode + ") " + response.statusText;
											cuerpo = jsonFormat.error.message.value;
										} catch (err) {
											try {
												if (response.responseJSON.cod !== undefined && response.responseJSON.cod !== null) {
													cabecera = "(" + response.responseJSON.cod + ") " + response.responseJSON.msg;
													cuerpo = "";
												} else if (response.responseJSON.errorCode !== undefined && response.responseJSON.errorCode !== null) {
													cabecera = "(" + response.responseJSON.errorCode + ") " + response.responseJSON.message;
													cuerpo = "";
												} else {
													cabecera = "Error al validar con la SUNAT para la factura : " + parte1 + "-" + parte2 + ".";
													cuerpo = "";
												}
											} catch (err) {
												cabecera = "Error al validar con la SUNAT para la factura : " + parte1 + "-" + parte2 + ".";
												cuerpo = "";
											}
										}
									}

									this.getView().byId("idValidacionFacySunat1").setText(cabecera + " " + cuerpo);
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
					} else {
						this.getView().byId("idValidacionFacySunat1").setType("Success");
						this.getView().byId("idValidacionFacySunat2").setType("Success");
						this.getView().byId("idValidacionFacySunat3").setType("Success");
					}
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

		encode_utf8: function (s) {
			return unescape(encodeURIComponent(s));
		},

		funDatosXMLInsertado: function () {

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var file = this._file;
			var vector = [];
			var llave = {};

			var archivoValidar = file.name;
			var fileTexto = file.name;
			archivoValidar = archivoValidar.split(".");
			var formatoTexto = "." + archivoValidar[archivoValidar.length - 1];
			fileTexto = fileTexto.substring(0, fileTexto.length - formatoTexto.length);
			var textoUtf8 = this.encode_utf8(fileTexto);
			//$.ajax('/METODO/GuardarFTP2?nombre=' + textoUtf8, {
			$.ajax("" + this.varTableDocumentConsultar + "" + textoUtf8, {
				method: 'GET',
				success: function (response) {
					response = response.toString();
					response = response.split("<t1>");
					response = response[1];
					response = response.split("</t1>");
					response = response[0];
					var cont = 0;
					var vectorReg = response.split("|");
					var vectorFinal = [];
					var llaveFinal = {};
					for (var i = 0; i < vectorReg.length; i++) {
						var registro = vectorReg[i].split("/");
						if (registro.length !== 1) {
							llaveFinal = {};
							llaveFinal.objectTypeId = registro[1];
							llaveFinal.name = registro[2];
							llaveFinal.createdBy = registro[3];
							llaveFinal.objectId = registro[4];
							llaveFinal.contentStreamFileName = registro[5];
							llaveFinal.contentStreamMimeType = registro[6];
							llaveFinal.contentStreamLength = registro[7];
							vectorFinal.push(llaveFinal);
						}
					}
					for (var i = 0; i < vectorFinal.length; i++) {
						var nombre = vectorFinal[i].contentStreamFileName;
						if (nombre.includes(fileTexto) && nombre.includes(formatoTexto)) {
							cont++;
						}
					}

					llave.clistTabDocuArchivo = file;
					llave.clistTabDocuEstado = "Documento Válido";
					llave.clistTabDocuExension = file.type;

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

					llave.clistTabDocuFecha = date;
					llave.clistTabDocuHora = time;

					//llave.clistTabDocuNombreArch = file.name;
					if (cont === 0) {
						llave.clistTabDocuNombreArch = file.name;
					} else {
						cont++;
						var filename = file.name;
						filename = filename.split(".");
						var formatoTexto2 = filename[filename.length - 1];
						var fileTexto2 = file.name;
						formatoTexto2 = formatoTexto2.length + 1;
						fileTexto2 = fileTexto2.substring(0, fileTexto2.length - formatoTexto2);
						llave.clistTabDocuNombreArch = fileTexto2 + " (" + cont + ")." + filename[filename.length - 1];
					}
					var varlistTabDocuNombreArch = file.name;

					var vartxt1 = "";
					var vectortxt1 = [];
					var llavetxt1 = {};
					for (var k = 0; k < varlistTabDocuNombreArch.length; k++) {
						if (varlistTabDocuNombreArch.substring(k, k + 1) !== "-") {
							vartxt1 = vartxt1 + varlistTabDocuNombreArch.substring(k, k + 1);
						}
						if (varlistTabDocuNombreArch.substring(k, k + 1) === "-" || k === varlistTabDocuNombreArch.length - 1) {
							llavetxt1 = {};
							llavetxt1.Dato = vartxt1;
							vectortxt1.push(llavetxt1);
							vartxt1 = "";
						}
					}
					llave.clistTabDocuRUC = vectortxt1[0].Dato;
					llave.clistTabDocuTipo = vectortxt1[1].Dato;
					llave.clistTabDocuSerie = vectortxt1[2].Dato;
					llave.clistTabDocuNumero = vectortxt1[3].Dato.substring(0, vectortxt1[3].Dato.length - 4);

					llave.clistTabDocuTamano = (parseFloat(file.size) / 1024).toFixed(2) + " KB";
					llave.clistTabDocuTamanoNum = (parseFloat(file.size).toFixed(2) / 1024).toString();

					////////////////////////// Binario /////////////////////////////////
					var that = this;
					if (!FileReader.prototype.readAsBinaryString) {
						FileReader.prototype.readAsBinaryString = function (fileData) {
							var binary = "";
							var reader = new FileReader();
							reader.onload = function (e) {
								var bytes = new Uint8Array(reader.result);
								var length = bytes.byteLength;
								for (var i = 0; i < length; i++) {
									binary += String.fromCharCode(bytes[i]);
								}
								that.base64ConversionRes = btoa(binary);
								sap.ui.getCore().fileUploadArr.push({
									"DocumentType": "001",
									"MimeType": file.type,
									"FileName": file.name,
									"Content": that.base64ConversionRes
								});
							};
							reader.readAsArrayBuffer(fileData);
						};
					}

					var reader = new FileReader();
					reader.onload = function (readerEvt) {
						var binaryString = readerEvt.target.result;
						that.base64ConversionRes = btoa(binaryString);
						llave.clistTabBinario = that.base64ConversionRes;
					}.bind(this);
					reader.readAsBinaryString(file);
					////////////////////////// Binario /////////////////////////////////

					vector.push(llave);
					oModel.setProperty("/listTablaDocumentos", vector);
				}.bind(this),
				error: function (err) {
					sap.m.MessageToast.show("No se pudo cargar el documento " + file.name + ".");
					dialog.setBusy(false);
				}.bind(this)
			});
		},

		btnAnadirDocSus: function () {

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var myParam = this.getView().getModel("myParam");

			var varSelecTipoCarga = this.getView().byId("idComboTipo").getSelectedItem().getKey();
			// Selecciona cuales son los Documentos Obligatorios
			var varDocumentosObli = "Otros";
			var varDocumentosNoObli = "Otros";
			if (varSelecTipoCarga === "N") {
				varDocumentosObli = "01 - xml y LQ -pdf";
				varDocumentosNoObli = "Otros";
			}

			// Tabla de Documentos
			var oTablepdf = new sap.ui.table.Table("idListaDocumentos", {
				visibleRowCount: 7,
				alternateRowColors: true,
				selectionMode: "None",
				width: "100%",
				rows: "{myParam>/listTablaDocumentos}"
			});
			/*oTablepdf.addColumn(new sap.ui.table.Column({
				width: "4rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cant."
				}),
				template: new sap.m.Text({
					text: "{myParam>clistTabDocuCant}"
				})
			}));*/
			oTablepdf.addColumn(new sap.ui.table.Column({
				width: "4rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Tipo"
				}),
				template: new sap.m.Text({
					text: "{myParam>clistTabDocuTipo}"
				})
			}));
			oTablepdf.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "RUC"
				}),
				template: new sap.m.Text({
					text: "{myParam>clistTabDocuRUC}"
				})
			}));
			oTablepdf.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Num. Serie"
				}),
				template: new sap.m.Text({
					text: "{myParam>clistTabDocuSerie}"
				})
			}));
			oTablepdf.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Num. Comprobante"
				}),
				template: new sap.m.Text({
					text: "{myParam>clistTabDocuNumero}"
				})
			}));
			oTablepdf.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Tamaño"
				}),
				template: new sap.m.Text({
					text: "{myParam>clistTabDocuTamano}"
				})
			}));
			oTablepdf.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Extensión"
				}),
				template: new sap.m.Text({
					text: "{myParam>clistTabDocuExension}"
				})
			}));
			oTablepdf.addColumn(new sap.ui.table.Column({
				width: "18rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Estado"
				}),
				template: new sap.m.ObjectStatus({
					text: "{myParam>clistTabDocuEstado}",
					state: {
						path: "myParam>clistTabDocuEstado",
						formatter: function (total) {

							if (total === "Documento Válido") {
								return "Success";
							} else {
								return "Error";
							}
						}.bind(this)
					}

				})
			}));
			oTablepdf.addColumn(new sap.ui.table.Column({
				width: "3rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: ""
				}),
				template: new sap.m.Button({
					width: "100%",
					type: "Reject",
					icon: "sap-icon://delete",
					press: function (oEvent) {

						// Obtener los datos del Item selecconados
						var oItem = oEvent.getSource();
						var oContext = oItem.getBindingContext("myParam");

						// Obtener el ID principal de lo seleccionado
						var vEliLaborID = oContext.getPath();
						var varId = vEliLaborID;
						var vEliLaborIDNew = varId.substring(vEliLaborID.length, vEliLaborID.length - 1);
						if (vEliLaborIDNew !== "0") {
							// Procedimiento
							var oEmployees = oModel.getProperty("/listTablaDocumentos");

							oEmployees.splice(vEliLaborIDNew, 1);

							// Actualizar la tabla listLabores
							oModel.setProperty("/listTablaDocumentos", oEmployees);

							// Contar Registros
							sap.ui.getCore().byId("idContarDocumentTbl").setText("Cantidad de Registros: (" + oModel.getProperty(
								"/listTablaDocumentos").length + ")");
						} else {
							sap.m.MessageToast.show("No se puede eliminar el documento XML");
						}
					}
				})
			}));

			oTablepdf.setModel(myParam, "myParam");

			oThis = this;
			var dialog = new sap.m.Dialog({
				title: 'Carga de Documentos Sustentos',
				contentWidth: "1120px",
				type: 'Message',
				state: 'Success',
				content: [
					new sap.m.Label({
						text: "Documentos",
						design: "Bold",
						width: "100%"
					}),
					new sap.ui.unified.FileUploader("idDocumentos", {
						name: "myFileUpload1",
						uploadUrl: "uploadUrl1",
						tooltip: "Subir Documento",
						width: "70%",
						placeholder: "Archivos",
						change: function (e) {
							sap.ui.getCore()._file = e.getParameter("files") && e.getParameter("files")[0];
						},
						//fileType: ["pdf", "doc", "xml"],
						buttonText: "Buscar",
						style: "Emphasized",
						icon: "sap-icon://laptop"
					}),
					new sap.m.Label({
						text: "",
						width: "3%"
					}),
					new sap.m.Button({
						text: "Subir",
						width: "27%",
						type: "Emphasized",
						press: function () {
							dialog.setBusy(true);
							//var view = this.getView();
							var inputs = [
								sap.ui.getCore().byId("idDocumentos")
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

								var file = sap.ui.getCore()._file;
								// Extraer Datos del nombre del Documento
								var varNameDoc = sap.ui.getCore().byId("idDocumentos").getValue();
								var vartxt1 = "";
								var vectortxt1 = [];
								var llavetxt1 = {};
								for (var k = 0; k < varNameDoc.length; k++) {
									if (varNameDoc.substring(k, k + 1) !== "-") {
										vartxt1 = vartxt1 + varNameDoc.substring(k, k + 1);
									}
									if (varNameDoc.substring(k, k + 1) === "-" || k === varNameDoc.length - 1) {
										llavetxt1 = {};
										llavetxt1.Dato = vartxt1;
										vectortxt1.push(llavetxt1);
										vartxt1 = "";
									}
								}
								// Extraer los Datos de cabecera de la factura
								var numComprFact = oModel.getProperty("/pages/0/description");
								var vartxt2 = "";
								var vectortxt2 = [];
								var llavetxt2 = {};
								for (var k = 0; k < numComprFact.length; k++) {
									if (numComprFact.substring(k, k + 1) !== "-") {
										vartxt2 = vartxt2 + numComprFact.substring(k, k + 1);
									}
									if (numComprFact.substring(k, k + 1) === "-" || k === numComprFact.length - 1) {
										llavetxt2 = {};
										llavetxt2.Dato = vartxt2;
										vectortxt2.push(llavetxt2);
										vartxt2 = "";
									}
								}
								var docSerieComp = vectortxt2[0].Dato;
								var docNumeroComp = parseInt(vectortxt2[1].Dato, 10).toString();
								var docRUCComp = oModel.getProperty("/listItemCabeceraFactura/4/value");
								var docTipoComp = oModel.getProperty("/listItemCabeceraFactura/5/value");
								// Validar Datos de Cabecera con el nombre del Documento
								var vector = oModel.getProperty("/listTablaDocumentos");

								var varContadorValidor = oThis.funValidarDocumentos(vector, file);

								if (varContadorValidor === 0) {
									var archivoValidar = file.name;
									var fileTexto = file.name;
									archivoValidar = archivoValidar.split(".");
									var formatoTexto = "." + archivoValidar[archivoValidar.length - 1];
									fileTexto = fileTexto.substring(0, fileTexto.length - formatoTexto.length);
									var textoUtf8 = this.encode_utf8(fileTexto);
									//$.ajax('/METODO/GuardarFTP2?nombre=' + textoUtf8, {
									$.ajax("" + this.varTableDocumentConsultar + "" + textoUtf8, {
										method: 'GET',
										success: function (response) {
											response = response.toString();
											response = response.split("<t1>");
											response = response[1];
											response = response.split("</t1>");
											response = response[0];
											var cont = 0;
											var vectorReg = response.split("|");
											var vectorFinal = [];
											var llaveFinal = {};
											for (var i = 0; i < vectorReg.length; i++) {
												var registro = vectorReg[i].split("/");
												if (registro.length !== 1) {
													llaveFinal = {};
													llaveFinal.objectTypeId = registro[1];
													llaveFinal.name = registro[2];
													llaveFinal.createdBy = registro[3];
													llaveFinal.objectId = registro[4];
													llaveFinal.contentStreamFileName = registro[5];
													llaveFinal.contentStreamMimeType = registro[6];
													llaveFinal.contentStreamLength = registro[7];
													vectorFinal.push(llaveFinal);
												}
											}
											for (var i = 0; i < vectorFinal.length; i++) {
												var nombre = vectorFinal[i].contentStreamFileName;
												if (nombre.includes(fileTexto) && nombre.includes(formatoTexto)) {
													cont++;
												}
											}
											////////////////////////////////////////////////////////////////////////////////////////////////
											var llave = {};
											//llave.clistTabDocuNumero = varNameDoc;
											var varUltimoValor = vectortxt1[vectortxt1.length - 1].Dato.substring(0, vectortxt1[vectortxt1.length - 1].Dato.length -
												4);
											varUltimoValor = parseInt(varUltimoValor, 10).toString();
											var varTamTblTipoComp = oModel.getProperty("/listTipoComprobante").length;
											for (var i = 0; i < vectortxt1.length; i++) {
												/*for (var j = 0; j < varTamTblTipoComp; j++) {
													if (vectortxt1[i].Dato === oModel.getProperty("/listTipoComprobante/" + j + "/clistTipoComprobanteValue")) {
														llave.clistTabDocuTipo = vectortxt1[i].Dato;
													}
												}*/
												if (vectortxt1[i].Dato === docSerieComp) {
													llave.clistTabDocuSerie = docSerieComp;
												}
												if (varUltimoValor === docNumeroComp) {
													llave.clistTabDocuNumero = docNumeroComp;
												}
												if (vectortxt1[i].Dato === docRUCComp) {
													llave.clistTabDocuRUC = docRUCComp;
												}
											}

											var oFileUploader = sap.ui.getCore().byId("idDocumentos");
											var fileDoc = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
											llave.clistTabDocuArchivo = fileDoc;
											if (cont === 0) {
												llave.clistTabDocuNombreArch = fileDoc.name;
											} else {
												cont++;
												var filename = fileDoc.name;
												filename = filename.split(".");
												var formatoTexto2 = filename[filename.length - 1];
												var fileTexto2 = fileDoc.name;
												formatoTexto2 = formatoTexto2.length + 1;
												fileTexto2 = fileTexto2.substring(0, fileTexto2.length - formatoTexto2);
												llave.clistTabDocuNombreArch = fileTexto2 + " (" + cont + ")." + filename[filename.length - 1];
											}
											// llave.clistTabDocuNombreArch = fileDoc.name;
											llave.clistTabDocuTipo = vectortxt1[1].Dato;

											var fecha = fileDoc.lastModifiedDate;
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

											llave.clistTabDocuFecha = date;
											llave.clistTabDocuHora = time;

											var varContError = 0;
											var varMenssageError = null;
											llave.clistTabDocuEstado = "Documento Válido";
											if (llave.clistTabDocuSerie === docSerieComp) {} else {
												llave.clistTabDocuEstado = "Num. de Serie inválido";
												varMenssageError = "El Número de Serie no coincide con el de la Factura";
												varContError++;
											}

											if (llave.clistTabDocuNumero === docNumeroComp) {} else {
												llave.clistTabDocuEstado = "Num. de Comprobante inválido";
												varMenssageError = "El Número de Comprobante no coincide con el de la Factura";
												varContError++;
											}

											if (llave.clistTabDocuRUC === docRUCComp) {} else {
												llave.clistTabDocuEstado = "Num de RUC inválido";
												varMenssageError = "El Número de RUC no coincide con el RUC de Usuario";
												varContError++;
											}

											llave.clistTabDocuTamano = (parseFloat(file.size) / 1024).toFixed(2) + " KB";
											llave.clistTabDocuTamanoNum = (parseFloat(file.size).toFixed(2) / 1024).toString();
											llave.clistTabDocuExension = file.type;

											if (varContError === 0) {

												////////////////////////// Binario /////////////////////////////////
												var that = this;
												if (!FileReader.prototype.readAsBinaryString) {
													FileReader.prototype.readAsBinaryString = function (fileData) {
														var binary = "";
														var reader = new FileReader();
														reader.onload = function (e) {
															var bytes = new Uint8Array(reader.result);
															var length = bytes.byteLength;
															for (var i = 0; i < length; i++) {
																binary += String.fromCharCode(bytes[i]);
															}
															that.base64ConversionRes = btoa(binary);
															sap.ui.getCore().fileUploadArr.push({
																"DocumentType": "001",
																"MimeType": file.type,
																"FileName": file.name,
																"Content": that.base64ConversionRes
															});
														};
														reader.readAsArrayBuffer(fileData);
													};
												}

												var reader = new FileReader();
												reader.onload = function (readerEvt) {
													var binaryString = readerEvt.target.result;
													that.base64ConversionRes = btoa(binaryString);
													if (that.base64ConversionRes.length < 5000000) {
														llave.clistTabBinario = that.base64ConversionRes;
														vector.push(llave);
														oModel.setProperty("/listTablaDocumentos", vector);
														sap.ui.getCore().byId("idContarDocumentTbl").setText("Cantidad de Registros: (" + vector.length + ")");
														dialog.setBusy(false);
													} else {
														sap.m.MessageToast.show("El documento " + file.name + " tiene un tamaño superior al establecido.");
														dialog.setBusy(false);
													}
												}.bind(this);
												reader.readAsBinaryString(file);
												////////////////////////// Binario /////////////////////////////////

												// vector.push(llave);
												// oModel.setProperty("/listTablaDocumentos", vector);
												// sap.ui.getCore().byId("idContarDocumentTbl").setText("Cantidad de Registros: (" + vector.length + ")");
											} else {
												var dialog55Error = new sap.m.Dialog({
													title: "Alerta",
													type: "Message",
													state: "Warning",
													content: new sap.m.Text({
														text: varMenssageError

													}),
													beginButton: new sap.m.Button({
														text: "OK",
														press: function () {
															dialog55Error.close();
															dialog55Error.destroy();
														}
													}),
													afterClose: function () {
														dialog55Error.destroy();
													}
												});
												dialog55Error.open();
												dialog.setBusy(false);
											}

											if (file && window.FileReader) {
												var reader = new FileReader();
												reader.onload = function (evn) {
													var strCSV = evn.target.result; //string in CSV 
													var oModel2 = new sap.ui.model.xml.XMLModel();
													oModel2.setXML(strCSV);

												}.bind(this);
												reader.readAsText(file);
											}
										}.bind(this),
										error: function (err) {
											sap.m.MessageToast.show("No se pudo cargar el documento " + file.name + ".");
											dialog.setBusy(false);
										}.bind(this)
									});
									////////////////////////////////////////////////////////////////////////////////////////////////
								} else if (varContadorValidor === 2) {
									var dialog55 = new sap.m.Dialog({
										title: "Error",
										type: "Message",
										state: "Error",
										content: new sap.m.Text({
											text: "El nombre del documento no tiene la estructura correcta."
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
									dialog.setBusy(false);
								} else {
									var dialog55 = new sap.m.Dialog({
										title: "Alerta",
										type: "Message",
										state: "Warning",
										content: new sap.m.Text({
											text: "Se ha intentado subir un documento ya existente."

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
									dialog.setBusy(false);
								}

							} else {
								var dialog55 = new sap.m.Dialog({
									title: "Alerta",
									type: "Message",
									state: "Warning",
									content: new sap.m.Text({
										text: "Se requiere seleccionar algún Documento."

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
								dialog.setBusy(true);
							}
						}.bind(this)
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Label({
						text: "Tipos de Docs. Obligatorios     : " + varDocumentosObli,
						hAlign: "Center",
						width: "77%"
					}),
					new sap.m.Label({
						text: "",
						width: "23%"
					}),
					new sap.m.Label({
						text: "Tipos de Docs. No Obligatorios  : " + varDocumentosNoObli,
						hAlign: "Center",
						width: "80%"
					}),
					new sap.m.Label("idContarDocumentTbl", {
						text: "Cantidad de Documentos: (" + oModel.getProperty("/listTablaDocumentos").length + ")",
						width: "20%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					oTablepdf
				],
				beginButton: new sap.m.Button({
					text: 'Aceptar',
					type: 'Emphasized',
					press: function () {

						var vartamtblDocOK = oModel.getProperty("/listTablaDocumentos").length;

						var varContNoEstado = 0;
						for (var j = 0; j < vartamtblDocOK; j++) {
							var opcFiltroEstadoOK = oModel.getProperty("/listTablaDocumentos/" + j + "/clistTabDocuEstado");
							if (opcFiltroEstadoOK !== "Documento Válido") {
								varContNoEstado++;
							}
						}

						var varContErrorBinario = 0;
						var matrizBin = [];
						var llaveBin = {};
						for (var z = 0; z < vartamtblDocOK; z++) {
							var opcFiltroErrorBinario = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabBinario").length;
							if (opcFiltroErrorBinario > 5000000) {
								varContErrorBinario++;
								llaveBin = {};
								llaveBin.clistTabDocuNombreArch = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuNombreArch");
								llaveBin.clistTabDocuTipo = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuTipo");
								llaveBin.clistTabDocuRUC = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuRUC");
								llaveBin.clistTabDocuSerie = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuSerie");
								llaveBin.clistTabDocuArchivo = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuArchivo");
								llaveBin.webkitRelativePath = oModel.getProperty("/listTablaDocumentos/" + z + "/webkitRelativePath");
								llaveBin.clistTabDocuNumero = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuNumero");
								llaveBin.clistTabDocuFecha = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuFecha");
								llaveBin.clistTabDocuHora = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuHora");
								llaveBin.clistTabDocuTamano = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuTamano");
								llaveBin.clistTabDocuTamanoNum = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuTamanoNum");
								llaveBin.clistTabDocuExension = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuExension");
								llaveBin.clistTabDocuEstado = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabDocuEstado");
								llaveBin.clistTabBinario = oModel.getProperty("/listTablaDocumentos/" + z + "/clistTabBinario");
								matrizBin.push(llaveBin);
							}
						}
						this.funActualizarEstadoDoc(matrizBin);

						if (varContErrorBinario === 0) {
							if (varContNoEstado === 0) {
								if (this.getView().byId("idComboTipo").getSelectedItem().getKey() === "N") {

									var contTipo = 0;
									for (var k = 0; k < vartamtblDocOK; k++) {
										var opcFiltro = oModel.getProperty("/listTablaDocumentos/" + k + "/clistTabDocuTipo");
										var opcFiltroExtension = oModel.getProperty("/listTablaDocumentos/" + k + "/clistTabDocuExension");
										if (opcFiltro === "01" && opcFiltroExtension === "text/xml") {
											contTipo = contTipo + 1;
										} else if (opcFiltro === "LQ" && opcFiltroExtension === "application/pdf") {
											contTipo = contTipo + 1;
										}
									}

									if (contTipo < 2) {

										var dialogMesage2 = new sap.m.Dialog({
											title: 'Alerta',
											type: 'Message',
											state: 'Warning',
											content: new sap.m.Text({
												text: 'Debe Ingresar todos los Documentos Sustentos Requeridos'
											}),
											beginButton: new sap.m.Button({
												text: 'Aceptar',
												type: 'Emphasized',
												press: function () {
													this.getView().byId("idValidacionDoc").setText(
														"Se requiere asignar todos los Documentos Sustentos de la factura.");
													this.getView().byId("idValidacionDoc").setType("Warning");
													this.getView().byId("idFacturar").setEnabled(false); // poner validacion false
													dialogMesage2.close();
												}.bind(this)
											}),
											afterClose: function () {
												dialogMesage2.destroy();
											}
										});
										this.varGlobalContDocu = contTipo;
										dialogMesage2.open();
										dialog.close();

										this.getView().byId("idValidacionDoc").setText("Se requiere asignar todos los Documentos Sustentos de la factura.");
										this.getView().byId("idValidacionDoc").setType("Warning");
										this.verificarAsignaciónPosFactura();
										this.varGlobalContDocu = contTipo;

									} else {

										var vattbl1 = oModel.getProperty("/listTablaDocumentos");
										oModel.setProperty("/listTablaDocumentosTemp", vattbl1);
										this.getView().byId("idValidacionDoc").setText("Todos los Documentos Sustentos de la factura asignadas.");
										this.getView().byId("idValidacionDoc").setType("Success");
										this.verificarAsignaciónPosFactura();
										this.varGlobalContDocu = contTipo;
										dialog.close();
									}
								}
							} else {
								var dialogMesage3 = new sap.m.Dialog({
									title: 'Alerta',
									type: 'Message',
									state: 'Error',
									content: new sap.m.Text({
										text: 'Uno de los Documentos tiene Error de Estado'
									}),
									beginButton: new sap.m.Button({
										text: 'Aceptar',
										type: 'Emphasized',
										press: function () {
											dialogMesage3.close();
										}.bind(this)
									}),
									afterClose: function () {
										dialogMesage3.destroy();
									}
								});
								this.varGlobalContDocu = contTipo;
								dialogMesage3.open();
							}
						} else {
							var dialogMesage7 = new sap.m.Dialog({
								title: 'Alerta',
								type: 'Message',
								state: 'Error',
								contentWidth: '700px',
								content: [
									new sap.m.Text({
										text: 'Algunos documentos sobrepasaron el tamaño requerido, revisar el ',
										wrapping: true,
										width: "420px"
									}),
									new sap.m.Label({
										text: " estado ",
										wrapping: true,
										design: "Bold",
										width: "50px"
									}),
									new sap.m.Text({
										text: 'de cada documento.',
										wrapping: true,
										width: "150px"
									}),
								],
								beginButton: new sap.m.Button({
									text: 'Aceptar',
									type: 'Emphasized',
									press: function () {
										dialogMesage7.close();
									}.bind(this)
								}),
								afterClose: function () {
									dialogMesage7.destroy();
								}
							});
							dialogMesage7.open();
						}

					}.bind(this)
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		funActualizarEstadoDoc: function (matrix) {

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var vartamtblDocOK = oModel.getProperty("/listTablaDocumentos").length;
			var vartamtblDocErr = matrix.length;
			var registro = {};
			var varContNoEstado = 0;
			for (var i = 0; i < vartamtblDocOK; i++) {
				var opcFiltroEstadoOK = oModel.getProperty("/listTablaDocumentos/" + i + "/clistTabDocuNombreArch");
				for (var j = 0; j < vartamtblDocErr; j++) {
					if (opcFiltroEstadoOK === matrix[j].clistTabDocuNombreArch) {
						var vItemObject = i;
						registro = {};
						registro.clistTabDocuArchivo = matrix[j].clistTabDocuArchivo;
						registro.webkitRelativePath = matrix[j].webkitRelativePath;
						registro.clistTabDocuFecha = matrix[j].clistTabDocuFecha;
						registro.clistTabDocuHora = matrix[j].clistTabDocuHora;
						registro.clistTabDocuTamanoNum = matrix[j].clistTabDocuTamanoNum;
						registro.clistTabBinario = matrix[j].clistTabBinario;
						registro.clistTabDocuTipo = matrix[j].clistTabDocuTipo;
						registro.clistTabDocuRUC = matrix[j].clistTabDocuRUC;
						registro.clistTabDocuSerie = matrix[j].clistTabDocuSerie;
						registro.clistTabDocuNumero = matrix[j].clistTabDocuNumero;
						registro.clistTabDocuTamano = matrix[j].clistTabDocuTamano;
						registro.clistTabDocuExension = matrix[j].clistTabDocuExension;
						registro.clistTabDocuEstado = "Documento Inválido (tamaño excedido)";
						var tblDocumentos = "/listTablaDocumentos/" + vItemObject;
						oModel.setProperty(tblDocumentos, registro);
					}
				}
			}
			sap.ui.getCore().byId("idListaDocumentos").getBinding("rows").refresh(true);
		},

		funValidarDocumentos: function (vector, file) {

			try {

				var varName = file.name;
				var varExtension = file.type;
				var vartxt1 = "";
				var vectortxt1 = [];
				var llavetxt1 = {};
				for (var k = 0; k < varName.length; k++) {
					if (varName.substring(k, k + 1) !== "-") {
						vartxt1 = vartxt1 + varName.substring(k, k + 1);
					}
					if (varName.substring(k, k + 1) === "-" || k === varName.length - 1) {
						llavetxt1 = {};
						llavetxt1.Dato = vartxt1;
						vectortxt1.push(llavetxt1);
						vartxt1 = "";
					}
				}

				var varRUC = vectortxt1[0].Dato;
				var varTipo = vectortxt1[1].Dato;
				var varNumSerie = vectortxt1[2].Dato;
				var varName2 = vectortxt1[3].Dato;


				var vartxt2 = "";
				var vectortxt2 = [];
				var llavetxt2 = {};
				for (var k = 0; k < varName2.length; k++) {
					if (varName2.substring(k, k + 1) !== ".") {
						vartxt2 = vartxt2 + varName2.substring(k, k + 1);
					}
					if (varName2.substring(k, k + 1) === "." || k === varName2.length - 1) {
						llavetxt2 = {};
						llavetxt2.Dato = vartxt2;
						vectortxt2.push(llavetxt2);
						vartxt2 = "";
					}
				}

				var varNumComprobante = parseInt(vectortxt2[0].Dato, 10).toString();

				var varRespuesta = 0;
				if (vector.length !== 0) {
					for (var i = 0; i < vector.length; i++) {
						if (vector[i].clistTabDocuTipo === varTipo &&
							vector[i].clistTabDocuRUC === varRUC &&
							vector[i].clistTabDocuSerie === varNumSerie &&
							vector[i].clistTabDocuNumero.replace(/^(0+)/g, '') === varNumComprobante.replace(/^(0+)/g, '') &&//GM0411
							vector[i].clistTabDocuExension === varExtension) {
							varRespuesta = 1;
						}
					}

					if (varRespuesta === 0) {
					} else {
					}
				}

				return varRespuesta;
			} catch (err) {
				return 2;
			}
		},

		funObtenerSelecValesIngreso: function (tbTotal, tbFaltante) {

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var varTamTotal = tbTotal.length;
			var varTamFaltante = tbFaltante.length;

			var tbSeleccionado = [];
			var varCont = 0;
			for (var i = 0; i < varTamTotal; i++) {
				varCont = 0;
				for (var j = 0; j < varTamFaltante; j++) {
					if (tbTotal[i].DE_POSICION === tbFaltante[j].DE_POSICION &&
						tbTotal[i].DE_NUMERO_ORDEN === tbFaltante[j].DE_NUMERO_ORDEN &&
						tbTotal[i].DE_DOC_MATERIAL === tbFaltante[j].DE_DOC_MATERIAL &&
						tbTotal[i].DE_POS_DOC_MATERIAL === tbFaltante[j].DE_POS_DOC_MATERIAL) {
						varCont++;
					}
				}
				if (varCont === 0) {
					tbSeleccionado.push(tbTotal[i]);
				}
			}
			oModel.setProperty("/listSeleccionValesIngreso", tbSeleccionado);
		}

	});
});