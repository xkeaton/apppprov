sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Registro_Factura", {

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
		// MAURO 20211014
		varTableT_DETRACCION: "",
		varTableT_SERV_DETRACCION: "",
		varTableT_MAT_DETRACCION: "",
		// MAURO 20211014

		_file: "",

		ordenCompraGlobal: null,
		posFacturaGlobal: null,
		detalleFacturaGlobal: [],
		detallePosFacturaGlobal: [],
		detalleAdjuntoGlobal: [],
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
		varVariableAsignacionTolerancia: 0,
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
			// MAURO 20211014
			this.varTableT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_DETRACCION");
			this.varTableT_SERV_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_SERV_DETRACCION");
			this.varTableT_MAT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_MAT_DETRACCION");
			// MAURO 20211014

			this.getView().byId("idLabelValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
			this.getView().byId("idValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
			this.getView().byId("idUdpLabelValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
		},
		onInit: function () {
			var oThis = this;
			oThis.getRouter().getRoute("Vista_Registro_Factura").attachMatched(this._onRouteMatched, this);
			this.getView().byId("idTableItemDetalleFac").setSelectionMode("Single");
			this.getView().byId("idTableItemDetalleFac").setSelectionBehavior("RowOnly");
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("quickViewCard").addStyleClass("miCarta");
			this.getView().byId("SplitAppDemo1").addStyleClass("miSplit");
			this.getView().byId("idNav").addStyleClass("miIconoBlanco");

			// Proceso Metodo Out-Time
			// Guardamos el contexto en la variable that, ya que dentro de la función anónima no podríamos utilizar el this refiriéndonos a el contexto de la app.
			/*var that = this;
			setInterval(
				function () {
					// Aquí pondemos el trozo de código o a la función que queremos llamar.
					that.refreshData();
				},
				// Seteamos el tiempo en milisegundos
				10000
			);*/

		},

		_onRouteMatched: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			var varOdata = oModel.getProperty("/codigoDetr1");

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
			llaveCabeceraFacLabel[10] = "Tipo de detracción";
			llaveCabeceraFacLabel[11] = "Dirección";

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
			llaveCabeceraFacValue[10] = "-----";
			llaveCabeceraFacValue[11] = "-----";

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
			// Iniciar Cabecera de la factura XML
			oModel.setProperty("/listDocAdjuntarFac", []); //gm26102021
			oModel.setProperty("/listItemFacturas", []); //gm26102021
			oModel.setProperty("/listItemFacturasxeliminar", []); //gm03112021
			oModel.setProperty("/listItemFacturaPosicion", []); //gm26102021		
			oModel.setProperty("/listItemFacturaPosicionxeliminar", []); //gm03112021		

			// Borrar seleccion checks de las tablas

			this.getView().byId("idXML").setValue("");
			this.getView().byId("idFacturar").setEnabled(false);
			this.getView().byId("idAnadirDocSus").setEnabled(false);
			this.getView().byId("idAsignar").setEnabled(false);
			this.getView().byId("idValidacionFacAsig").setText("Sin items a asignar");
			this.getView().byId("idValidacionFacAsig").setType("Information");
			this.getView().byId("idValidacionDoc").setText("Sin Documentos Sustentos a asignar");
			this.getView().byId("idValidacionDoc").setType("Information");
			this.getView().byId("idValidacionDeta").setText("Sin detracción a validar"); // MAURO 20211014
			this.getView().byId("idValidacionDeta").setType("Information"); // MAURO 20211014
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
			// MAURO 20211014
			this.varTableT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_DETRACCION");
			this.varTableT_SERV_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_SERV_DETRACCION");
			this.varTableT_MAT_DETRACCION = oModel.getProperty("/listTablasOData/clistTablasODataT_MAT_DETRACCION");
			// MAURO 20211014

			this.updateServicioSunat();
			this.updateServicioDiaHabil();
			this.updateServicioDiaCalendario(); //I@MM-16/12/2021-Ticket-2021-999
			this.updateServicioTolerancia();
			// MAURO 20211014
			this.llenarTablas(this.varTableT_DETRACCION, "tblDetraccion");
			this.llenarTablas(this.varTableT_SERV_DETRACCION, "tblServDetraccion");
			this.llenarTablas(this.varTableT_MAT_DETRACCION, "tblMatDetraccion");
			// MAURO 20211014

			this.getView().byId("idLabelValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
			this.getView().byId("idValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
			this.getView().byId("idUdpLabelValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
		},

		llenarTablas: function (tabla, json) { // MAURO 20211014
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
							vector.push(llave);
						}
						oModel.setProperty("/" + json, vector);
					} catch (err) {
						oModel.setProperty("/" + json, []);
					}
				}.bind(this),
				error: function (oError) {
					oModel.setProperty("/" + json, []);
				}.bind(this)
			});
		},

		updateServicioDiaHabil: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);

			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("SERVICIO", sap.ui.model.FilterOperator.EQ, "Validacion_dias_habiles");
			filters.push(filter);

			oModelOData.read("/" + this.varTableT_SERVICIOS + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					if (lenghtV !== 0) {

						var vector = [];
						vector = oModelJSON.getData();
						if (oModelJSON.getData()[0].ESTADO === "X") {} else {}
					}

					oModel.setProperty("/listTablasODataDiasHabiles", vector);
				}.bind(this),
				error: function (oError) {}.bind(this)
			});
		},

		//Begin I@MM-16/12/2021-Ticket-2021-999
		updateServicioDiaCalendario: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);

			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("SERVICIO", sap.ui.model.FilterOperator.EQ, "Validacion_dias_calendario");
			filters.push(filter);

			oModelOData.read("/" + this.varTableT_SERVICIOS + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					if (lenghtV !== 0) {

						var vector = [];
						vector = oModelJSON.getData();
						if (oModelJSON.getData()[0].ESTADO === "X") {} else {}
					}

					oModel.setProperty("/listTablasODataDiasCalendario", vector);
				}.bind(this),
				error: function (oError) {}.bind(this)
			});
		},
		//End I@MM-16/12/2021-Ticket-2021-999

		updateServicioTolerancia: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);

			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("SERVICIO", sap.ui.model.FilterOperator.EQ, "Validacion_porcentaje_tolerancia");
			filters.push(filter);

			oModelOData.read("/" + this.varTableT_SERVICIOS + "?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					if (lenghtV !== 0) {

						var vector = [];
						vector = oModelJSON.getData();
						if (oModelJSON.getData()[0].ESTADO === "X") {} else {}
					}

					oModel.setProperty("/listTablasODataTolerancia", vector);
					this.varVariableAsignacionTolerancia = oModelJSON.getData()[0].CAMPO1;
				}.bind(this),
				error: function (oError) {}.bind(this)
			});
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

					}.bind(this)
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
						}.bind(this),
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

									}.bind(this)
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
					}.bind(this)
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
			var usuarioLogin = oModel.getProperty("/usuarioLogin");
			var usuarioRuc = oModel.getProperty("/usuarioRuc");
			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var cabecera = myParam.getProperty("/listItemCabeceraFactura");
			var oContext = oItem.getBindingContext("myParam");
			var listItemDetalleFactura = oModel.getProperty("/listItemDetalleFactura");
			// Obtener el ID principal de lo seleccionado
			var valObject = oContext.getPath();
			this.posFacturaGlobal = valObject;
			var pathFacturaItem = valObject;
			var vector = [];
			var llaveSeleccionada = {};
			llaveSeleccionada.POS = oModel.getProperty(valObject + "/clistItemDetalleFacturaPosicion");
			llaveSeleccionada.COD = oModel.getProperty(valObject + "/clistItemDetalleFacturaCodigo");
			llaveSeleccionada.MATERIAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaDescripcion");
			var netoxItem = parseFloat(oModel.getProperty(valObject + "/clistItemDetalleFacturaValorVenxItem")).toFixed(2);
			llaveSeleccionada.NETO = netoxItem;
			llaveSeleccionada.MONEDA = cabecera[8].value.trim();
			llaveSeleccionada.ORDEN_COMPRA = oModel.getProperty(valObject + "/clistItemsOrdenCompra");

			llaveSeleccionada.TOTAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaTotal");
			var listaValesIngreso = oModel.getProperty("/listaValesIngreso");
			oModel.setProperty("/listTotalValesIngreso", listaValesIngreso);
			var listaValesIngresoSalvado = listaValesIngreso;
			var total = 0;
			var selectedItem = this.getView().byId("idComboTipo").getSelectedItem();
			var llaveTipo = selectedItem.getKey();
			var vectorEliminar = [];
			var realizar = true;
			var varVisibleCampoHes = "";
			if (llaveTipo === "S") {
				varVisibleCampoHes = false;
			} else if (llaveTipo === "H") {
				varVisibleCampoHes = true;
			}

			var varVisibleCampoSuministro = "";
			if (llaveTipo === "H") {
				varVisibleCampoSuministro = false;
			} else if (llaveTipo === "S") {
				varVisibleCampoSuministro = true;
			}
			for (var k = 0; k < listaValesIngreso.length; k++) {
				realizar = true;
				for (var l = 0; l < listItemDetalleFactura.length; l++) {

					if (listItemDetalleFactura[l].clistItemDetalleFacturaPosicion !== llaveSeleccionada.POS) {
						for (var m = 0; m < listItemDetalleFactura[l].clistItemsOrdenCompra.length; m++) {
							var ordenCompraSelect = listItemDetalleFactura[l].clistItemsOrdenCompra[m];
							if (listaValesIngreso[k].DE_POSICION === ordenCompraSelect.DE_POSICION &&
								listaValesIngreso[k].DE_NUMERO_ORDEN === ordenCompraSelect.DE_NUMERO_ORDEN &&
								listaValesIngreso[k].DE_POS_DOC_MATERIAL === ordenCompraSelect.DE_POS_DOC_MATERIAL) {
								if (llaveTipo === "S") {
									if (listaValesIngreso[k].DE_DOC_MATERIAL === ordenCompraSelect.DE_DOC_MATERIAL) {
										realizar = false;
									}
								} else {
									if (listaValesIngreso[k].DE_HOJA_ENTRADA === ordenCompraSelect.DE_HOJA_ENTRADA) {
										realizar = false;
									}
								}
							}
						}
					}

				}
				if (realizar) {
					if (listaValesIngreso[k].DE_FLAC !== "x") {
						vectorEliminar.push(listaValesIngreso[k]);
					}
				}
			}

			listaValesIngreso = vectorEliminar;

			for (var j = 0; j < listaValesIngreso.length; j++) {
				listaValesIngreso[j].selectItem = false;
			}
			for (var i = 0; i < llaveSeleccionada.ORDEN_COMPRA.length; i++) {
				total += parseFloat(llaveSeleccionada.ORDEN_COMPRA[i].DE_TOTAL.toString().replace(',', ''));
				for (var j = 0; j < listaValesIngreso.length; j++) {
					if (listaValesIngreso[j].DE_POSICION === llaveSeleccionada.ORDEN_COMPRA[i].DE_POSICION &&
						listaValesIngreso[j].DE_NUMERO_ORDEN === llaveSeleccionada.ORDEN_COMPRA[i].DE_NUMERO_ORDEN &&
						listaValesIngreso[j].DE_POS_DOC_MATERIAL === llaveSeleccionada.ORDEN_COMPRA[i].DE_POS_DOC_MATERIAL) {
						if (llaveTipo === "S") {
							if (listaValesIngreso[j].DE_DOC_MATERIAL === llaveSeleccionada.ORDEN_COMPRA[i].DE_DOC_MATERIAL) {
								listaValesIngreso[j].selectItem = true;
							}
						} else {
							if (listaValesIngreso[j].DE_HOJA_ENTRADA === llaveSeleccionada.ORDEN_COMPRA[i].DE_HOJA_ENTRADA) {
								listaValesIngreso[j].selectItem = true;
							}
						}

					}
				}
			}
			total = total.toFixed(2);
			vector.push(llaveSeleccionada);
			oModel.setProperty("/listaValesIngreso", listaValesIngreso);
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
					text: "Valor Sin IGV"
				}),
				template: new sap.m.ObjectNumber({
					number: "{NETO}",
					unit: "{MONEDA}"
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
				width: "72.8rem",
				rows: "{/listaValesIngreso}",
				noData: [
					new sap.m.Text({
						text: "Sin documentos de ingreso encontrados."
					})
				]
			});
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "3.5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: ""
				}),
				template: new sap.m.CheckBox({
					selected: "{selectItem}",
					valueState: "Warning",
					select: function (evt) {
						var objeto = evt.getSource().getBindingContext().getObject();
						var monedaFactura = cabecera[8].value.trim();

						if (objeto.DE_MONEDA === monedaFactura) {
							var posicion = objeto.DE_POSICION;
							var ordenCompra = objeto.DE_NUMERO_ORDEN;
							var listaValesIngreso = oModel.getProperty("/listaValesIngreso");
							var vectorVerificacion = [];
							var realizar = true;
							var motivo = "";
							for (var v = 0; v < listaValesIngreso.length; v++) {
								if (listaValesIngreso[v].selectItem) {
									//if (listaValesIngreso[v].DE_NUMERO_ORDEN === ordenCompra) {
									//if (listaValesIngreso[v].DE_POSICION === posicion) {
									var varMonedaOC = oModel.getProperty("/listItemCabeceraFactura/8/value");
									if (listaValesIngreso[v].DE_MONEDA === varMonedaOC) {
										vectorVerificacion.push(listaValesIngreso[v]);
									} else {
										realizar = false;
										motivo = "No se puede asignar una Posición con moneda distinta de la Factura.";
										v = listaValesIngreso.length;
									}
									/*} else {
										realizar = false;
										motivo = "No se puede asignar dos Posiciones distintas.";
										v = listaValesIngreso.length;
									}*/
									/*} else {
										realizar = false;
										motivo = "No se puede asignar dos Ordenes de compra distintas.";
										v = listaValesIngreso.length;
									}*/
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
										totalVale += parseFloat(listaValesIngreso[v].DE_TOTAL.toString().replace(',', ''), 10);
									}
								}
								var subTotal = [];
								var llaveSub = {};
								llaveSub.total = totalVale.toFixed(2);
								subTotal.push(llaveSub);
								myParam.setProperty("/subTotal", subTotal);
							}
						} else {
							sap.m.MessageToast.show("Solo se puede asignar importes con la moneda de la factura : " + monedaFactura);
							evt.getSource().setSelected(false);
						}
						// netoxItem						
					}.bind(this)
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Fecha Ingreso"
				}),
				template: new sap.m.Text({
					text: "{DE_FEC_CONTABILIZACION}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Guía Remisión"
				}),
				template: new sap.m.Text({
					text: "{DE_GUIA_REMISION}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "6rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "O.C."
				}),
				template: new sap.m.Text({
					text: "{DE_NUMERO_ORDEN}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column("idCampoHes", {
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
				width: "7rem",
				hAlign: "Center",
				visible: varVisibleCampoHes,
				label: new sap.m.Text({
					text: "HES N°"
				}),
				template: new sap.m.Text({
					text: "{DE_HOJA_ENTRADA}"
				})
			}));
			/*oTableItem.addColumn(new sap.ui.table.Column({
				width: "9rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Documento Ingreso"
				}),
				template: new sap.m.Text({}).bindProperty("text", {
					parts: [{
						path: 'DE_DOC_MATERIAL'
					}, {
						path: 'DE_HOJA_ENTRADA'
					}, {
						path: 'DE_TIPO'
					}],
					formatter: function (docMaterial, hojaServicio, tipo) {
						if (tipo === "S") {
							return docMaterial;
						} else {
							return hojaServicio;
						}
					}.bind(this)
				})

			}));*/
			/*oTableItem.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Pos. Doc. Material"
				}),
				template: new sap.m.Text({
					text: "{DE_POS_DOC_MATERIAL}"
				})
			}));*/
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cod. de Material"
				}),
				template: new sap.m.Text({}).bindProperty("text", {
					parts: [{
						path: 'DE_NUM_MATERIAL'
					}],
					formatter: function (valor) {
						if (valor !== "" && valor !== null && valor !== undefined) {
							//valor = parseFloat(valor, 10).toFixed(2);
							//valor = valor.toString();
							var opc = 1;
							var varResulTexto = "";
							for (var i = 0; i < valor.length; i++) {
								if (opc !== 0) {
									if (valor.substring(i, i + 1) !== "0") {
										varResulTexto = varResulTexto + valor.substring(i, i + 1);
										opc = 0;
									}
								} else {
									varResulTexto = varResulTexto + valor.substring(i, i + 1);
								}
							}
							return varResulTexto;
						} else {
							return "";
						}
					}.bind(this)
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				visible: varVisibleCampoSuministro,
				label: new sap.m.Text({
					text: "Doc. Material"
				}),
				template: new sap.m.Text({
					text: "{DE_DOC_MATERIAL}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "20rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Material"
				}),
				template: new sap.m.Text({
					text: "{DE_DESCRIPCION}"
				})
			}));

			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cantidad"
				}),
				template: new sap.m.ObjectNumber({
					number: "{DE_CANTIDAD}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe"
				}),
				template: new sap.m.ObjectNumber({
					number: "{DE_TOTAL}",
					unit: "{DE_MONEDA}"
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

							var valorNetoMas5 = parseFloat(netoxItem) + 1;
							valorNetoMas5 = valorNetoMas5.toFixed(2);
							var valorNetoMenos5 = parseFloat(netoxItem) - 1;
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

				title: "Documentos de ingreso",
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
										text: "Fecha Ingreso",
										valueState: "Warning"
									}),
									new sap.m.DatePicker("idFecVale", {
										valueStateText: "El campo fecha de vale no debe estar vacío.",
										valueFormat: "yyyy-MM-dd",
										displayFormat: "yyyy-MM-dd",
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
										text: "N° de Orden de Compra",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 10,
										id: "idNroVale",
										valueStateText: "El campo N° de Orden de Compra no debe estar vacío.",
										placeholder: "Ingrese N° de Orden de Compra (10)...",
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
										text: "Guía de remisión",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idGuia",
										valueStateText: "El campo guía de remisión no debe estar vacío.",
										placeholder: "Ingrese guía de remisión (16)...",
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
										text: "Cod. de Material",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idCodMaterial",
										valueStateText: "El campo código de material no debe estar vacío.",
										placeholder: "Ingrese código de material (16)...",
										width: "100%"
									})
								]
							}),
							new sap.ui.layout.VerticalLayout({
								width: "20%",
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckDesMaterial",
										text: "Material",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idDesMaterial",
										valueStateText: "El campo descripción de material no debe estar vacío.",
										placeholder: "Ingrese descripción de material (16)...",
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
									if (sap.ui.getCore().byId("idCheckFecVale").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idFecVale"));
									}
									if (sap.ui.getCore().byId("idCheckVale").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idNroVale"));
									}
									if (sap.ui.getCore().byId("idCheckGuia").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idGuia"));
									}
									if (sap.ui.getCore().byId("idCheckCodMaterial").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idCodMaterial"));
									}
									if (sap.ui.getCore().byId("idCheckDesMaterial").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idDesMaterial"));
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
											var filter = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
											aFilters.push(filter);
											jQuery.each(inputs, function (i, input) {
												var valor = input.getValue();
												var idCampo = input.getId();
												if (idCampo === "idFecVale") {
													filter = new sap.ui.model.Filter("DE_FEC_REGISTRO", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idNroVale") {
													if (comboKey === "S") {
														filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.Contains, valor);
														aFilters.push(filter);
													} else {
														filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.Contains, valor);
														aFilters.push(filter);
													}
												} else if (idCampo === "idGuia") {
													filter = new sap.ui.model.Filter("DE_GUIA_REMISION", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idCodMaterial") {
													filter = new sap.ui.model.Filter("DE_NUM_MATERIAL", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idDesMaterial") {
													filter = new sap.ui.model.Filter("DE_DESCRIPCION", sap.ui.model.FilterOperator.Contains, valor);
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
										sap.ui.getCore().byId("idGuia"),
										sap.ui.getCore().byId("idCodMaterial"),
										sap.ui.getCore().byId("idDesMaterial")
									];
									jQuery.each(inputs, function (i, input) {
										input.setValueState("None");
									});
									var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();
									var aFilters = [];
									var filter = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
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
							text: "Tabla de asignación por Documentos de ingreso"
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

						var listaValesIngreso = oModel.getProperty("/listaValesIngreso");
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
						debugger;
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
					oModel.setProperty("/listaValesIngreso", listaValesIngresoSalvado);
				}.bind(this),
				afterOpen: function () {
					oTable.getBinding("rows").refresh(true);
					var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();

					var aFilters = [];
					var filter = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
					aFilters.push(filter);
					filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
					aFilters.push(filter);
					filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, this.varRucDeLaEmpresa);
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

		btnBuscarItem2: function (oEvent) {
			// Llamar modelo
			console.log("btnBuscarItem2");
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
			var myParam = this.getView().getModel("myParam");
			var usuarioLogin = oModel.getProperty("/usuarioLogin");
			var usuarioRuc = oModel.getProperty("/usuarioRuc");
			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var cabecera = myParam.getProperty("/listItemCabeceraFactura");
			var oContext = oItem.getBindingContext("myParam");
			var listItemDetalleFactura = oModel.getProperty("/listItemDetalleFactura");
			// Obtener el ID principal de lo seleccionado
			//var valObject = oContext.getPath();
			var valObject = "/listItemDetalleFactura/0";
			this.posFacturaGlobal = valObject;
			var pathFacturaItem = valObject;
			var vector = [];
			var llaveSeleccionada = {};
			llaveSeleccionada.POS = oModel.getProperty(valObject + "/clistItemDetalleFacturaPosicion");
			llaveSeleccionada.COD = oModel.getProperty(valObject + "/clistItemDetalleFacturaCodigo");
			llaveSeleccionada.MATERIAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaDescripcion");
			var netoxItem = parseFloat(oModel.getProperty(valObject + "/clistItemDetalleFacturaValorVenxItem")).toFixed(2);
			llaveSeleccionada.NETO = netoxItem;
			llaveSeleccionada.MONEDA = cabecera[8].value.trim();
			llaveSeleccionada.ORDEN_COMPRA = oModel.getProperty(valObject + "/clistItemsOrdenCompra");
			llaveSeleccionada.TOTALFACTURA = this.getView().byId("idImporteTotalIGV").getValue();
			llaveSeleccionada.TOTALITEMSFACTURA = oModel.getProperty("/listItemDetalleFactura").length;

			llaveSeleccionada.TOTAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaTotal");
			var listaValesIngreso = oModel.getProperty("/listaValesIngreso");
			oModel.setProperty("/listTotalValesIngreso", listaValesIngreso);
			var listaValesIngresoSalvado = listaValesIngreso;
			var total = 0;
			var selectedItem = this.getView().byId("idComboTipo").getSelectedItem();
			var llaveTipo = selectedItem.getKey();
			var vectorEliminar = [];
			var realizar = true;
			var varVisibleCampoHes = "";
			var varVisibleCampoHesTamano = "";
			if (llaveTipo === "S") {
				varVisibleCampoHes = false;
				varVisibleCampoHesTamano = "0%";
			} else if (llaveTipo === "H") {
				varVisibleCampoHes = true;
				varVisibleCampoHesTamano = "20%";
			}

			var varVisibleCampoSuministro = "";
			var varVisibleCampoSuministroTamano = "";
			if (llaveTipo === "H") {
				varVisibleCampoSuministro = false;
				varVisibleCampoSuministroTamano = "0%";
			} else if (llaveTipo === "S") {
				varVisibleCampoSuministro = true;
				varVisibleCampoSuministroTamano = "20%";
			}
			for (var k = 0; k < listaValesIngreso.length; k++) {
				realizar = true;
				for (var l = 0; l < listItemDetalleFactura.length; l++) {

					if (listItemDetalleFactura[l].clistItemDetalleFacturaPosicion !== llaveSeleccionada.POS) {
						for (var m = 0; m < listItemDetalleFactura[l].clistItemsOrdenCompra.length; m++) {
							var ordenCompraSelect = listItemDetalleFactura[l].clistItemsOrdenCompra[m];
							if (listaValesIngreso[k].DE_POSICION === ordenCompraSelect.DE_POSICION &&
								listaValesIngreso[k].DE_NUMERO_ORDEN === ordenCompraSelect.DE_NUMERO_ORDEN &&
								listaValesIngreso[k].DE_POS_DOC_MATERIAL === ordenCompraSelect.DE_POS_DOC_MATERIAL) {
								if (llaveTipo === "S") {
									if (listaValesIngreso[k].DE_DOC_MATERIAL === ordenCompraSelect.DE_DOC_MATERIAL) {
										realizar = false;
									}
								} else {
									if (listaValesIngreso[k].DE_HOJA_ENTRADA === ordenCompraSelect.DE_HOJA_ENTRADA) {
										realizar = false;
									}
								}
							}
						}
					}

				}
				if (realizar) {
					if (listaValesIngreso[k].DE_FLAC !== "x") {
						vectorEliminar.push(listaValesIngreso[k]);
					}
				}
			}

			listaValesIngreso = vectorEliminar;

			for (var j = 0; j < listaValesIngreso.length; j++) {
				listaValesIngreso[j].selectItem = false;
			}
			for (var i = 0; i < llaveSeleccionada.ORDEN_COMPRA.length; i++) {
				total += parseFloat(llaveSeleccionada.ORDEN_COMPRA[i].DE_TOTAL.toString().replace(',', ''));
				for (var j = 0; j < listaValesIngreso.length; j++) {
					if (listaValesIngreso[j].DE_POSICION === llaveSeleccionada.ORDEN_COMPRA[i].DE_POSICION &&
						listaValesIngreso[j].DE_NUMERO_ORDEN === llaveSeleccionada.ORDEN_COMPRA[i].DE_NUMERO_ORDEN &&
						listaValesIngreso[j].DE_POS_DOC_MATERIAL === llaveSeleccionada.ORDEN_COMPRA[i].DE_POS_DOC_MATERIAL) {
						if (llaveTipo === "S") {
							if (listaValesIngreso[j].DE_DOC_MATERIAL === llaveSeleccionada.ORDEN_COMPRA[i].DE_DOC_MATERIAL) {
								listaValesIngreso[j].selectItem = true;
							}
						} else {
							if (listaValesIngreso[j].DE_HOJA_ENTRADA === llaveSeleccionada.ORDEN_COMPRA[i].DE_HOJA_ENTRADA) {
								listaValesIngreso[j].selectItem = true;
							}
						}

					}
				}
			}
			total = total.toFixed(2);
			vector.push(llaveSeleccionada);
			oModel.setProperty("/listaValesIngreso", listaValesIngreso);
			myParam.setProperty("/facturaSeleccionada", vector);

			var oTable = new sap.ui.table.Table({
				visibleRowCount: 1,
				alternateRowColors: true,
				selectionMode: "None",
				width: "23rem",
				rows: "{/facturaSeleccionada}"
			});
			/*oTable.addColumn(new sap.ui.table.Column({
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
			}));*/
			oTable.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Total de Posiciones"
				}),
				template: new sap.m.Text({
					//text: "{MATERIAL}"
					text: "{TOTALITEMSFACTURA}"
				})
			}));
			oTable.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Valor sin IGV"
				}),
				template: new sap.m.Text({
					//text: "{NETOCIGV}"
					text: "{TOTALFACTURA}"
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
				rows: "{/listaValesIngreso}",
				noData: [
					new sap.m.Text({
						text: "Sin documentos de ingreso encontrados."
					})
				]
			});
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "3.5rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: ""
				}),
				template: new sap.m.CheckBox({
					selected: "{selectItem}",
					valueState: "Warning",
					select: function (evt) {
						var objeto = evt.getSource().getBindingContext().getObject();
						var monedaFactura = cabecera[8].value.trim();

						/////////////////////////20201113///////////////////////////

						var oThis = this;
						var oModel = oThis.getView().getModel("myParam");
						var listaValesIngresoConsig = oModel.getProperty("/listaValesIngreso");
						var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();

						var varDocMaterialHes = "";
						if (comboKey === "S") {
							varDocMaterialHes = objeto.DE_DOC_MATERIAL;
						} else if (comboKey === "H") {
							varDocMaterialHes = objeto.DE_HOJA_ENTRADA;
						}
						var context44444 = evt.getSource().getBindingContext().getObject();
						var vEliLaborID = evt.getSource().getBindingContext().getPath().substring(19, evt.getSource().getBindingContext().getPath()
							.length);
						var varMonedaOCAnt = oModel.getProperty("/listItemCabeceraFactura/8/value");
						var list = sap.ui.getCore().byId("idTableListaTotal");
						var binding = list.getBinding("rows");
						var varTam2 = binding.aIndices.length;

						var varConteoSelectTrue = 0;
						var vectorOC = [];
						var llaveOC = {};
						for (var k = 0; k < varTam2; k++) {
							if (listaValesIngresoConsig[binding.aIndices[k]].selectItem) {
								varConteoSelectTrue++;
								llaveOC = {};
								llaveOC.OC = listaValesIngresoConsig[binding.aIndices[k]].DE_NUMERO_ORDEN;
								vectorOC.push(llaveOC);
							}
						}

						var varContadorDiferente = 0;
						for (var k1 = 0; k1 < vectorOC.length - 1; k1++) {
							var varOpcion1OC = vectorOC[k1].OC;
							var varOpcion2OC = vectorOC[k1 + 1].OC;
							if (varOpcion1OC !== varOpcion2OC) {
								varContadorDiferente++;
							}
						}

						/*if (varContadorDiferente === 0) {
							if (objeto.selectItem) {
								for (var i = 0; i < varTam2; i++) {
									if (i !== vEliLaborID) {
										if (comboKey === "S") {
											if (listaValesIngresoConsig[i].DE_DOC_MATERIAL === varDocMaterialHes && listaValesIngresoConsig[i].DE_MONEDA ===
												varMonedaOCAnt) {
												if (listaValesIngresoConsig[i].selectItem) {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
												} else {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
												}
											}
										} else if (comboKey === "H") {
											if (listaValesIngresoConsig[i].DE_HOJA_ENTRADA === varDocMaterialHes && listaValesIngresoConsig[i].DE_MONEDA ===
												varMonedaOCAnt) {
												if (listaValesIngresoConsig[i].selectItem) {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
												} else {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
												}
											}
										}
									}
								}
							} else {
								for (var i = 0; i < varTam2; i++) {
									if (i !== vEliLaborID) {
										if (comboKey === "S") {
											if (listaValesIngresoConsig[i].DE_DOC_MATERIAL === varDocMaterialHes && listaValesIngresoConsig[i].DE_MONEDA ===
												varMonedaOCAnt) {
												if (listaValesIngresoConsig[i].selectItem) {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
												} else {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
												}
											}
										} else if (comboKey === "H") {
											if (listaValesIngresoConsig[i].DE_HOJA_ENTRADA === varDocMaterialHes && listaValesIngresoConsig[i].DE_MONEDA ===
												varMonedaOCAnt) {
												if (listaValesIngresoConsig[i].selectItem) {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
												} else {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
												}
											}
										}
									}
								}
							}
						} else {
							evt.getSource().setSelected(false);
							sap.m.MessageToast.show("Solo se puede registrar importes con la misma orden de compra");
						}*/

						if (varContadorDiferente === 0) {
							if (objeto.selectItem) {
								for (var i = 0; i < varTam2; i++) {
									//if (i !== vEliLaborID) {
									if (binding.aIndices[i] !== vEliLaborID) {
										if (comboKey === "S") {
											//if (listaValesIngresoConsig[i].DE_DOC_MATERIAL === varDocMaterialHes && listaValesIngresoConsig[i].DE_MONEDA ===
											if (listaValesIngresoConsig[binding.aIndices[i]].DE_DOC_MATERIAL === varDocMaterialHes && listaValesIngresoConsig[
													binding.aIndices[i]].DE_MONEDA ===
												varMonedaOCAnt) {
												//if (listaValesIngresoConsig[i].selectItem) {
												if (listaValesIngresoConsig[binding.aIndices[i]].selectItem) {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
												} else {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
												}
											}
										} else if (comboKey === "H") {
											//if (listaValesIngresoConsig[i].DE_HOJA_ENTRADA === varDocMaterialHes && listaValesIngresoConsig[i].DE_MONEDA ===
											if (listaValesIngresoConsig[binding.aIndices[i]].DE_HOJA_ENTRADA === varDocMaterialHes && listaValesIngresoConsig[
													binding.aIndices[i]].DE_MONEDA ===
												varMonedaOCAnt) {
												//if (listaValesIngresoConsig[i].selectItem) {
												if (listaValesIngresoConsig[binding.aIndices[i]].selectItem) {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
												} else {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = true;
												}
											}
										}
									}
								}
							} else {
								for (var i = 0; i < varTam2; i++) {
									//if (i !== vEliLaborID) {
									if (binding.aIndices[i] !== vEliLaborID) {
										if (comboKey === "S") {
											//if (listaValesIngresoConsig[i].DE_DOC_MATERIAL === varDocMaterialHes && listaValesIngresoConsig[i].DE_MONEDA ===
											if (listaValesIngresoConsig[binding.aIndices[i]].DE_DOC_MATERIAL === varDocMaterialHes && listaValesIngresoConsig[
													binding.aIndices[i]].DE_MONEDA ===
												varMonedaOCAnt) {
												//if (listaValesIngresoConsig[i].selectItem) {
												if (listaValesIngresoConsig[binding.aIndices[i]].selectItem) {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
												} else {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
												}
											}
										} else if (comboKey === "H") {
											//if (listaValesIngresoConsig[i].DE_HOJA_ENTRADA === varDocMaterialHes && listaValesIngresoConsig[i].DE_MONEDA ===
											if (listaValesIngresoConsig[binding.aIndices[i]].DE_HOJA_ENTRADA === varDocMaterialHes && listaValesIngresoConsig[
													binding.aIndices[i]].DE_MONEDA ===
												varMonedaOCAnt) {
												//if (listaValesIngresoConsig[i].selectItem) {
												if (listaValesIngresoConsig[binding.aIndices[i]].selectItem) {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
												} else {
													listaValesIngresoConsig[binding.aIndices[i]].selectItem = false;
												}
											}
										}
									}
								}
							}
						} else {
							evt.getSource().setSelected(false);
							sap.m.MessageToast.show("Solo se puede registrar importes con la misma orden de compra");
						}

						////////////////////////////////////////////////////

						if (objeto.DE_MONEDA === monedaFactura) {
							var posicion = objeto.DE_POSICION;
							var ordenCompra = objeto.DE_NUMERO_ORDEN;
							var listaValesIngreso = oModel.getProperty("/listaValesIngreso");
							var vectorVerificacion = [];
							var realizar = true;
							var motivo = "";
							for (var v = 0; v < listaValesIngreso.length; v++) {
								if (listaValesIngreso[v].selectItem) {
									//if (listaValesIngreso[v].DE_NUMERO_ORDEN === ordenCompra) {
									//if (listaValesIngreso[v].DE_POSICION === posicion) {
									var varMonedaOC = oModel.getProperty("/listItemCabeceraFactura/8/value");
									if (listaValesIngreso[v].DE_MONEDA === varMonedaOC) {
										vectorVerificacion.push(listaValesIngreso[v]);
									} else {
										realizar = false;
										motivo = "No se puede asignar una Posición con moneda distinta de la Factura.";
										v = listaValesIngreso.length;
									}
									/*} else {
										realizar = false;
										motivo = "No se puede asignar dos Posiciones distintas.";
										v = listaValesIngreso.length;
									}*/
									/*} else {
										realizar = false;
										motivo = "No se puede asignar dos Ordenes de compra distintas.";
										v = listaValesIngreso.length;
									}*/
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
										totalVale += parseFloat(listaValesIngreso[v].DE_TOTAL.toString().replace(',', ''), 10);
									}
								}
								var subTotal = [];
								var llaveSub = {};
								llaveSub.total = totalVale.toFixed(2);
								subTotal.push(llaveSub);
								myParam.setProperty("/subTotal", subTotal);
							}
						} else {
							sap.m.MessageToast.show("Solo se puede asignar importes con la moneda de la factura : " + monedaFactura);
							evt.getSource().setSelected(false);
						}
						// netoxItem						
					}.bind(this)
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Fecha Ingreso"
				}),
				template: new sap.m.Text({
					text: "{DE_FEC_CONTABILIZACION}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "8rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Guía Remisión"
				}),
				template: new sap.m.Text({
					text: "{DE_GUIA_REMISION}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "6rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "O.C."
				}),
				template: new sap.m.Text({
					text: "{DE_NUMERO_ORDEN}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column("idCampoHes", {
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
				width: "7rem",
				hAlign: "Center",
				visible: varVisibleCampoHes,
				label: new sap.m.Text({
					text: "HES N°"
				}),
				template: new sap.m.Text({
					text: "{DE_HOJA_ENTRADA}"
				})
			}));
			/*oTableItem.addColumn(new sap.ui.table.Column({
				width: "9rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Documento Ingreso"
				}),
				template: new sap.m.Text({}).bindProperty("text", {
					parts: [{
						path: 'DE_DOC_MATERIAL'
					}, {
						path: 'DE_HOJA_ENTRADA'
					}, {
						path: 'DE_TIPO'
					}],
					formatter: function (docMaterial, hojaServicio, tipo) {
						if (tipo === "S") {
							return docMaterial;
						} else {
							return hojaServicio;
						}
					}.bind(this)
				})

			}));*/
			/*oTableItem.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Pos. Doc. Material"
				}),
				template: new sap.m.Text({
					text: "{DE_POS_DOC_MATERIAL}"
				})
			}));*/
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cod. de Material"
				}),
				template: new sap.m.Text({}).bindProperty("text", {
					parts: [{
						path: 'DE_NUM_MATERIAL'
					}],
					formatter: function (valor) {
						if (valor !== "" && valor !== null && valor !== undefined) {
							//valor = parseFloat(valor, 10).toFixed(2);
							//valor = valor.toString();
							var opc = 1;
							var varResulTexto = "";
							for (var i = 0; i < valor.length; i++) {
								if (opc !== 0) {
									if (valor.substring(i, i + 1) !== "0") {
										varResulTexto = varResulTexto + valor.substring(i, i + 1);
										opc = 0;
									}
								} else {
									varResulTexto = varResulTexto + valor.substring(i, i + 1);
								}
							}
							return varResulTexto;
						} else {
							return "";
						}
					}.bind(this)
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "10rem",
				hAlign: "Center",
				visible: varVisibleCampoSuministro,
				label: new sap.m.Text({
					text: "Doc. Material"
				}),
				template: new sap.m.Text({
					text: "{DE_DOC_MATERIAL}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "20rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Material"
				}),
				template: new sap.m.Text({
					text: "{DE_DESCRIPCION}"
				})
			}));

			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Cantidad"
				}),
				template: new sap.m.ObjectNumber({
					number: "{DE_CANTIDAD}"
				})
			}));
			oTableItem.addColumn(new sap.ui.table.Column({
				width: "7rem",
				hAlign: "Center",
				label: new sap.m.Text({
					text: "Importe"
				}),
				template: new sap.m.ObjectNumber({
					number: "{DE_TOTAL}",
					unit: "{DE_MONEDA}"
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
							var myParam = this.getView().getModel("myParam");
							//var valorNetoMas5 = parseFloat(netoxItem) + 1;
							var varProcentajeAsigancionTol = (parseFloat(myParam.getProperty("/facturaSeleccionada/0/TOTALFACTURA")) * parseFloat(
								this.varVariableAsignacionTolerancia.toString())) / 100;
							var valorNetoMas5 = parseFloat(myParam.getProperty("/facturaSeleccionada/0/TOTALFACTURA")) + varProcentajeAsigancionTol;
							valorNetoMas5 = valorNetoMas5.toFixed(2);
							//var valorNetoMenos5 = parseFloat(netoxItem) - 1;
							var valorNetoMenos5 = parseFloat(myParam.getProperty("/facturaSeleccionada/0/TOTALFACTURA")) - varProcentajeAsigancionTol;
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

				title: "Documentos de ingreso",
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
										text: "Fecha Ingreso",
										valueState: "Warning"
									}),
									new sap.m.DatePicker("idFecVale", {
										valueStateText: "El campo fecha de vale no debe estar vacío.",
										valueFormat: "yyyy-MM-dd",
										displayFormat: "yyyy-MM-dd",
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
										text: "N° de Orden de Compra",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 10,
										id: "idNroVale",
										valueStateText: "El campo N° de Orden de Compra no debe estar vacío.",
										placeholder: "Ingrese N° de Orden de Compra (10)...",
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
										text: "Guía de remisión",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idGuia",
										valueStateText: "El campo guía de remisión no debe estar vacío.",
										placeholder: "Ingrese guía de remisión (16)...",
										width: "100%"
									})
								]
							}),
							/*new sap.ui.layout.VerticalLayout({
								width: "20%",
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckCodMaterial",
										text: "Cod. de Material",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idCodMaterial",
										valueStateText: "El campo código de material no debe estar vacío.",
										placeholder: "Ingrese código de material (16)...",
										width: "100%"
									})
								]
							}),*/
							new sap.ui.layout.VerticalLayout({
								width: varVisibleCampoSuministroTamano,
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckDodMaterial",
										text: "Doc. Material",
										valueState: "Warning",
										visible: varVisibleCampoSuministro
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idDodMaterial",
										valueStateText: "El campo código de material no debe estar vacío.",
										placeholder: "Ingrese Documento de material...",
										visible: varVisibleCampoSuministro,
										width: "100%"
									})
								]
							}),
							new sap.ui.layout.VerticalLayout({
								width: varVisibleCampoHesTamano,
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckHess",
										text: "HES",
										valueState: "Warning",
										visible: varVisibleCampoHes
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idHess",
										valueStateText: "El campo código de material no debe estar vacío.",
										placeholder: "Ingrese HES...",
										visible: varVisibleCampoHes,
										width: "100%"
									})
								]
							}),
							new sap.ui.layout.VerticalLayout({
								width: "20%",
								content: [
									new sap.m.CheckBox({
										selected: false,
										id: "idCheckDesMaterial",
										text: "Material",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 16,
										id: "idDesMaterial",
										valueStateText: "El campo descripción de material no debe estar vacío.",
										placeholder: "Ingrese descripción de material (16)...",
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
									if (sap.ui.getCore().byId("idCheckFecVale").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idFecVale"));
									}
									if (sap.ui.getCore().byId("idCheckVale").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idNroVale"));
									}
									if (sap.ui.getCore().byId("idCheckGuia").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idGuia"));
									}
									if (sap.ui.getCore().byId("idCheckDodMaterial").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idDodMaterial"));
									}
									if (sap.ui.getCore().byId("idCheckHess").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idHess"));
									}
									if (sap.ui.getCore().byId("idCheckDesMaterial").getSelected()) {
										inputs.push(sap.ui.getCore().byId("idDesMaterial"));
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
											var filter = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
											aFilters.push(filter);
											jQuery.each(inputs, function (i, input) {
												var valor = input.getValue();
												var idCampo = input.getId();
												if (idCampo === "idFecVale") {
													filter = new sap.ui.model.Filter("DE_FEC_REGISTRO", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idNroVale") {
													if (comboKey === "S") {
														filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.Contains, valor);
														aFilters.push(filter);
													} else {
														filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.Contains, valor);
														aFilters.push(filter);
													}
												} else if (idCampo === "idGuia") {
													filter = new sap.ui.model.Filter("DE_GUIA_REMISION", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idDodMaterial") {
													filter = new sap.ui.model.Filter("DE_DOC_MATERIAL", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idHess") {
													filter = new sap.ui.model.Filter("DE_HOJA_ENTRADA", sap.ui.model.FilterOperator.Contains, valor);
													aFilters.push(filter);
												} else if (idCampo === "idDesMaterial") {
													filter = new sap.ui.model.Filter("DE_DESCRIPCION", sap.ui.model.FilterOperator.Contains, valor);
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
										sap.ui.getCore().byId("idGuia"),
										sap.ui.getCore().byId("idDodMaterial"),
										sap.ui.getCore().byId("idDesMaterial"),
										sap.ui.getCore().byId("idHess")
									];
									jQuery.each(inputs, function (i, input) {
										input.setValueState("None");
									});
									var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();
									var aFilters = [];
									var filter = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
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
							text: "Tabla de asignación por Documentos de ingreso"
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

						var listaValesIngreso = oModel.getProperty("/listaValesIngreso");
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
						debugger;
						oModel.setProperty(pathFacturaItem + "/clistItemsOrdenCompra", vector);
						this.subTotalOrdenCompra(vector);
						oDialogSelectItems.close();

						// MAURO 20211014
						var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();
						var oTblDetraccion = oModel.getProperty("/tblDetraccion");
						var oTblServDetraccion = oModel.getProperty("/tblServDetraccion");
						var oTblMatDetraccion = oModel.getProperty("/tblMatDetraccion");
						console.log(oTblDetraccion);
						console.log(oTblServDetraccion);
						console.log(oTblMatDetraccion);
						var oVectorCodMatServ = [];
						var oLlaveCodMatServ = {};

						for (var i = 0; i < listaValesIngreso.length; i++) {
							if (listaValesIngreso[i].selectItem) {
								if (comboKey === "S") {
									oLlaveCodMatServ = {};
									oLlaveCodMatServ.DE_NUM_MATERIAL = parseInt(listaValesIngreso[i].DE_NUM_MATERIAL, 10).toString();
									oVectorCodMatServ.push(oLlaveCodMatServ);
								} else {
									oLlaveCodMatServ = {};
									oLlaveCodMatServ.DE_NUM_SERVICIO = parseInt(listaValesIngreso[i].DE_NUM_SERVICIO, 10).toString();
									oVectorCodMatServ.push(oLlaveCodMatServ);
								}
							}
						}
						console.log(oVectorCodMatServ);

						console.log(this.oGlobalCodTipoDetraccion);
						if (this.oGlobalCodTipoDetraccion === "" || this.oGlobalCodTipoDetraccion === undefined || this.oGlobalCodTipoDetraccion ===
							"-----") {
							var oVectorDet = [];
							var oLlaveDet = {};
							if (comboKey === "S") {
								for (var i = 0; i < oVectorCodMatServ.length; i++) {
									for (var j = 0; j < oTblMatDetraccion.length; j++) {
										if (oVectorCodMatServ[i].DE_NUM_MATERIAL === oTblMatDetraccion[j].DE_NUM_MATERIAL) {
											oLlaveDet = {};
											oLlaveDet.NUMTP = oTblMatDetraccion[j].NUMTP;
											oVectorDet.push(oLlaveDet);
										}
									}
								}
							} else {
								for (var i = 0; i < oVectorCodMatServ.length; i++) {
									for (var j = 0; j < oTblServDetraccion.length; j++) {
										if (oVectorCodMatServ[i].DE_NUM_SERVICIO === oTblServDetraccion[j].DE_NUM_SERVICIO) {
											oLlaveDet = {};
											oLlaveDet.NUMTP = oTblServDetraccion[j].NUMTP;
											oVectorDet.push(oLlaveDet);
										}
									}
								}
							}
							console.log(oVectorDet);

							var oContDetNA = 0;
							for (var i = 0; i < oVectorDet.length; i++) {
								if (oVectorDet[i].NUMTP !== "N.A.") {
									oContDetNA++;
								}
							}

							if (oContDetNA === 0) {
								console.log("No existe Detracción");
								var oCodFinalDetraccion = "N.A.";
								console.log(oCodFinalDetraccion);

								var oDesFinalDetraccion = "NO APLICA";
								console.log(oDesFinalDetraccion);

								//this.getView().byId("idCodigoDetra2").setValue(oCodFinalDetraccion + " - " + oDesFinalDetraccion);
								for (var k = 0; k < oTblDetraccion.length; k++) {
									if (oModel.getProperty("/codigoDetr/" + k + "/codigo") === oCodFinalDetraccion) {
										var comboDetra = this.getView().byId("idCodigoDetra");
										comboDetra.getBinding("items").refresh(true);
										var firstItem = comboDetra.getItems()[k];
										comboDetra.setSelectedItem(firstItem, true);
									}
								}
								this.getView().byId("idValidacionDeta").setText("Detracción establecida.");
								this.getView().byId("idValidacionDeta").setType("Success");

								this.validarSunat();
								this.verificarAsignaciónPosFactura();
							} else {
								console.log("Existe Detracción");
								var oVectorDetPri = [];
								var oLlaveDetPri = {};
								for (var i = 0; i < oVectorDet.length; i++) {
									for (var j = 0; j < oTblDetraccion.length; j++) {
										if (oVectorDet[i].NUMTP === oTblDetraccion[j].NUMTP && oVectorDet[i].NUMTP !== "N.A.") {
											oLlaveDetPri = {};
											oLlaveDetPri.NUMTP = oTblDetraccion[j].NUMTP;
											oLlaveDetPri.PRIORIDAD = oTblDetraccion[j].PRIORIDAD;
											oVectorDetPri.push(oLlaveDetPri);
										}
									}
								}
								console.log(oVectorDetPri);

								oVectorDetPri = this.eliminarDuplicadosJSON(oVectorDetPri);
								console.log(oVectorDetPri);

								oVectorDetPri = this.sortJSON(oVectorDetPri, "PRIORIDAD", "asc");
								console.log(oVectorDetPri);

								var oObtenerPrimerValor = "";
								if (oVectorDetPri.length !== 0) {
									oObtenerPrimerValor = oVectorDetPri[0].PRIORIDAD;
									var oVectorResultFin = [];
									var oLlaveResultFin = {};

									for (var i = 0; i < oVectorDetPri.length; i++) {
										if (oVectorDetPri[i].PRIORIDAD === oObtenerPrimerValor) {
											oLlaveResultFin = {};
											oLlaveResultFin.NUMTP = oVectorDetPri[i].NUMTP;
											oLlaveResultFin.PRIORIDAD = oVectorDetPri[i].PRIORIDAD;
											oVectorResultFin.push(oLlaveResultFin);
										}
									}
									console.log(oVectorResultFin);

									oVectorResultFin = this.sortJSON(oVectorResultFin, "NUMTP", "asc");
									console.log(oVectorResultFin);

									var oCodFinalDetraccion = oVectorResultFin[0].NUMTP;
									console.log(oCodFinalDetraccion);

									var oDesFinalDetraccion = "";
									for (var i = 0; i < oTblDetraccion.length; i++) {
										if (oTblDetraccion[i].NUMTP === oCodFinalDetraccion) {
											oDesFinalDetraccion = oTblDetraccion[i].NTBEZ;
										}
									}
									console.log(oDesFinalDetraccion);

									//this.getView().byId("idCodigoDetra2").setValue(oCodFinalDetraccion + " - " + oDesFinalDetraccion);
									for (var k = 0; k < oTblDetraccion.length; k++) {
										if (parseInt(oModel.getProperty("/codigoDetr/" + k + "/codigo"), 10) === parseInt(oCodFinalDetraccion, 10)) {
											var comboDetra = this.getView().byId("idCodigoDetra");
											comboDetra.getBinding("items").refresh(true);
											var firstItem = comboDetra.getItems()[k];
											comboDetra.setSelectedItem(firstItem, true);
										}
									}
								} else {
									var comboDetra = this.getView().byId("idCodigoDetra");
									comboDetra.getBinding("items").refresh(true);
									firstItem = comboDetra.getItems()[0];
									comboDetra.setSelectedItem(firstItem, true);
									this.getView().byId("idCodigoDetra").setValueState("None");
								}

								this.getView().byId("idValidacionDeta").setText("Detracción establecida.");
								this.getView().byId("idValidacionDeta").setType("Success");

								this.validarSunat();
								this.verificarAsignaciónPosFactura();
							}
						} else {
							var oVectorDet = [];
							var oLlaveDet = {};
							if (comboKey === "S") {
								for (var i = 0; i < oVectorCodMatServ.length; i++) {
									for (var j = 0; j < oTblMatDetraccion.length; j++) {
										if (oVectorCodMatServ[i].DE_NUM_MATERIAL === oTblMatDetraccion[j].DE_NUM_MATERIAL) {
											oLlaveDet = {};
											oLlaveDet.NUMTP = oTblMatDetraccion[j].NUMTP;
											oVectorDet.push(oLlaveDet);
										}
									}
								}
							} else {
								for (var i = 0; i < oVectorCodMatServ.length; i++) {
									for (var j = 0; j < oTblServDetraccion.length; j++) {
										if (oVectorCodMatServ[i].DE_NUM_SERVICIO === oTblServDetraccion[j].DE_NUM_SERVICIO) {
											oLlaveDet = {};
											oLlaveDet.NUMTP = oTblServDetraccion[j].NUMTP;
											oVectorDet.push(oLlaveDet);
										}
									}
								}
							}
							console.log(oVectorDet);

							var oContDetNA = 0;
							for (var i = 0; i < oVectorDet.length; i++) {
								if (oVectorDet[i].NUMTP !== "N.A.") {
									oContDetNA++;
								}
							}

							if (oContDetNA === 0) {
								console.log("No existe Detracción");
								var oCodFinalDetraccion = "N.A.";
								console.log(oCodFinalDetraccion);

								var oDesFinalDetraccion = "NO APLICA";
								console.log(oDesFinalDetraccion);

								//this.getView().byId("idCodigoDetra2").setValue(oCodFinalDetraccion + " - " + oDesFinalDetraccion);
								for (var k = 0; k < oTblDetraccion.length; k++) {
									if (oModel.getProperty("/codigoDetr/" + k + "/codigo") === oCodFinalDetraccion) {
										var comboDetra = this.getView().byId("idCodigoDetra");
										comboDetra.getBinding("items").refresh(true);
										var firstItem = comboDetra.getItems()[k];
										comboDetra.setSelectedItem(firstItem, true);
									}
								}

								if (oCodFinalDetraccion === this.oGlobalCodTipoDetraccion) {
									this.getView().byId("idValidacionDeta").setText("Detracción establecida.");
									this.getView().byId("idValidacionDeta").setType("Success");
								} else {
									this.getView().byId("idValidacionDeta").setText("Error en la determinación de detracción."); // MAURO 20211014
									this.getView().byId("idValidacionDeta").setType("Warning");
								}
								this.validarSunat();
								this.verificarAsignaciónPosFactura();
							} else {
								console.log("Existe Detracción");
								var oVectorDetPri = [];
								var oLlaveDetPri = {};
								for (var i = 0; i < oVectorDet.length; i++) {
									for (var j = 0; j < oTblDetraccion.length; j++) {
										if (oVectorDet[i].NUMTP === oTblDetraccion[j].NUMTP && oVectorDet[i].NUMTP !== "N.A.") {
											oLlaveDetPri = {};
											oLlaveDetPri.NUMTP = oTblDetraccion[j].NUMTP;
											oLlaveDetPri.PRIORIDAD = oTblDetraccion[j].PRIORIDAD;
											oVectorDetPri.push(oLlaveDetPri);
										}
									}
								}
								console.log(oVectorDetPri);

								oVectorDetPri = this.eliminarDuplicadosJSON(oVectorDetPri);
								console.log(oVectorDetPri);

								oVectorDetPri = this.sortJSON(oVectorDetPri, "PRIORIDAD", "asc");
								console.log(oVectorDetPri);

								var oObtenerPrimerValor = "";
								if (oVectorDetPri.length !== 0) {
									oObtenerPrimerValor = oVectorDetPri[0].PRIORIDAD;
									var oVectorResultFin = [];
									var oLlaveResultFin = {};

									for (var i = 0; i < oVectorDetPri.length; i++) {
										if (oVectorDetPri[i].PRIORIDAD === oObtenerPrimerValor) {
											oLlaveResultFin = {};
											oLlaveResultFin.NUMTP = oVectorDetPri[i].NUMTP;
											oLlaveResultFin.PRIORIDAD = oVectorDetPri[i].PRIORIDAD;
											oVectorResultFin.push(oLlaveResultFin);
										}
									}
									console.log(oVectorResultFin);

									oVectorResultFin = this.sortJSON(oVectorResultFin, "NUMTP", "asc");
									console.log(oVectorResultFin);

									var oCodFinalDetraccion = oVectorResultFin[0].NUMTP;
									console.log(oCodFinalDetraccion);

									var oDesFinalDetraccion = "";
									for (var i = 0; i < oTblDetraccion.length; i++) {
										if (oTblDetraccion[i].NUMTP === oCodFinalDetraccion) {
											oDesFinalDetraccion = oTblDetraccion[i].NTBEZ;
										}
									}
									console.log(oDesFinalDetraccion);

									//this.getView().byId("idCodigoDetra2").setValue(oCodFinalDetraccion + " - " + oDesFinalDetraccion);
									for (var k = 0; k < oTblDetraccion.length; k++) {
										if (parseInt(oModel.getProperty("/codigoDetr/" + k + "/codigo"), 10) === parseInt(oCodFinalDetraccion, 10)) {
											var comboDetra = this.getView().byId("idCodigoDetra");
											comboDetra.getBinding("items").refresh(true);
											var firstItem = comboDetra.getItems()[k];
											comboDetra.setSelectedItem(firstItem, true);
										}
									}
								} else {
									var comboDetra = this.getView().byId("idCodigoDetra");
									comboDetra.getBinding("items").refresh(true);
									firstItem = comboDetra.getItems()[0];
									comboDetra.setSelectedItem(firstItem, true);
									this.getView().byId("idCodigoDetra").setValueState("None");
								}

								if (oCodFinalDetraccion === this.oGlobalCodTipoDetraccion) {
									this.getView().byId("idValidacionDeta").setText("Detracción establecida.");
									this.getView().byId("idValidacionDeta").setType("Success");
								} else {
									this.getView().byId("idValidacionDeta").setText("Error en la determación de la detracción.");
									this.getView().byId("idValidacionDeta").setType("Warning");
								}
								this.validarSunat();
								this.verificarAsignaciónPosFactura();
							}
						}
						// MAURO 20211014
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
					oModel.setProperty("/listaValesIngreso", listaValesIngresoSalvado);
				}.bind(this),
				afterOpen: function () {
					oTable.getBinding("rows").refresh(true);
					var comboKey = this.getView().byId("idComboTipo").getSelectedItem().getKey();

					var aFilters = [];
					var filter = new sap.ui.model.Filter("DE_TIPO", sap.ui.model.FilterOperator.EQ, comboKey);
					aFilters.push(filter);
					filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, usuarioLogin);
					aFilters.push(filter);
					filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, this.varRucDeLaEmpresa);
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

		sortJSON: function (data, key, orden) { // MAURO 20211014
			return data.sort(function (a, b) {
				var x = a[key],
					y = b[key];

				if (orden === 'asc') {
					return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				}

				if (orden === 'desc') {
					return ((x > y) ? -1 : ((x < y) ? 1 : 0));
				}
			});
		},

		eliminarDuplicadosJSON: function (arr) { // MAURO 20211014
			return arr.reduce(function (p, c) {

				// create an identifying id from the object values
				var id = [c.NUMTP].join('|');

				// if the id is not found in the temp array
				// add the object to the output array
				// and add the key to the temp array
				if (p.temp.indexOf(id) === -1) {
					p.out.push(c);
					p.temp.push(id);
				}
				return p;

				// return the deduped array
			}, {
				temp: [],
				out: []
			}).out;
		},

		changeCargaTipo: function (evt) {
			console.log("OK");
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
						this.limpiarPantalla2(); // MAURO 20211014
						console.log("OK");
						if (llave === "S") {
							this.getView().byId("idLabelValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
							this.getView().byId("idValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
							this.getView().byId("idUdpLabelValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
							console.log("S");
						} else {
							this.getView().byId("idLabelValorReferencial").setVisible(true); //I@MM-21/12/2021-Ticket-2021-999
							this.getView().byId("idValorReferencial").setVisible(true); //I@MM-21/12/2021-Ticket-2021-999
							this.getView().byId("idUdpLabelValorReferencial").setVisible(true); //I@MM-21/12/2021-Ticket-2021-999
							console.log("H");
						}
					}.bind(this),
					text: "Aceptar"
				}),
				endButton: new sap.m.Button({
					press: function () {
						dialogMensaje.close();
						if (llave === "S") {
							this.getView().byId("idComboTipo").setSelectedKey("H");
							console.log("S");
						} else {
							this.getView().byId("idComboTipo").setSelectedKey("S");
							console.log("H");
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
			//var valorNetoMas5 = parseFloat(valorNeto) + 1;
			var varProcentajeAsigancionTol = (parseFloat(myParam.getProperty("/facturaSeleccionada/0/TOTALFACTURA")) * parseFloat(this.varVariableAsignacionTolerancia
				.toString())) / 100;
			var valorNetoMas5 = parseFloat(myParam.getProperty("/facturaSeleccionada/0/TOTALFACTURA")) + varProcentajeAsigancionTol;
			valorNetoMas5 = valorNetoMas5.toFixed(2);
			//var valorNetoMenos5 = parseFloat(valorNeto) - 1;
			var valorNetoMenos5 = parseFloat(myParam.getProperty("/facturaSeleccionada/0/TOTALFACTURA")) - varProcentajeAsigancionTol;
			valorNetoMenos5 = valorNetoMenos5.toFixed(2);

			for (var i = 0; i < contenido.length; i++) {
				var valorIngreso = contenido[i].DE_TOTAL;
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
				if (listaItem[0].clistItemDetalleFacturaEstado !== "Asignado") {
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
							if (vartamtblDocOK !== 0 && this.getView().byId("idValidacionDeta").getType() !== "Warning" && this.getView().byId(
									"idValidacionDeta").getType() !== "Information") { // MAURO 20211014
								this.getView().byId("idFacturar").setEnabled(true);
							} else {
								this.getView().byId("idFacturar").setEnabled(false);
							}
						} else {
							this.getView().byId("idFacturar").setEnabled(false); // poner validacion false
						}
					} else {
						if (this.varEstadoSunat1 === "X") {
							this.getView().byId("idFacturar").setEnabled(false);
						} else {
							if (vartamtblDocOK !== 0 && this.getView().byId("idValidacionDoc").getType() !== "Warning" && this.getView().byId(
									"idValidacionDoc").getType() !== "Information") { // quitar || vartamtblDocOK === 0 20200116
								if (vartamtblDocOK !== 0 && this.getView().byId("idValidacionDeta").getType() !== "Warning" && this.getView().byId(
										"idValidacionDeta").getType() !== "Information") { // MAURO 20211014
									this.getView().byId("idFacturar").setEnabled(true);
								} else {
									this.getView().byId("idFacturar").setEnabled(false);
								}
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
									debugger;
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
						debugger;
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
					} catch (err) {}
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

						this.efectuarCargaFileXML2();
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
									this.limpiarPantalla();
									//this.efectuarCargaFileXML(); //D@MM-16/12/2021-Ticket-2021-999
									this.getView().byId("idLabelValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
									this.getView().byId("idValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
									this.getView().byId("idUdpLabelValorReferencial").setVisible(false); //I@MM-21/12/2021-Ticket-2021-999
									this.efectuarCargaFileXML2(); //I@MM-16/12/2021-Ticket-2021-999
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
							}.bind(this)
						}),
						afterClose: function () {
							dialog.destroy();
						}
					});
					dialog.open();
				}

			} catch (err) {}
		},

		validarFacturaFechaEmision: function (varFechaEmision) {

			var oModel = this.getView().getModel("myParam");
			var varMatrizDiasHabiles = oModel.getProperty("/listTablasODataDiasHabiles");

			var fechaUsu = new Date();
			fechaUsu.setHours(0, 0, 0, 0);

			var dia = varFechaEmision.substring(8, 10);
			var mes = varFechaEmision.substring(5, 7);
			var anio = varFechaEmision.substring(0, 4);
			/*if (dia.length === 2 && parseInt(dia, 10) < 10) {
				dia = dia.substring(1, 2);
			}
			if (mes.length === 2 && mes != "10" && mes != "11" && mes != "12") {
				mes = mes.substring(1, 2);
			}
			if ((mes == "10" || mes == "11" || mes == "12") && parseInt(dia, 10) > 10) {
				dia = parseInt(dia, 10) + 1;
			}*/
			varFechaEmision = anio + "-" + mes + "-" + dia;

			var dateFormatted1 = new Date(varFechaEmision + " 00:00:00");
			var varMesProximo1 = dateFormatted1.getMonth() + 2;
			if (varMesProximo1 === 13) {
				varMesProximo1 = "1";
				dateFormatted1.setFullYear(parseInt(dateFormatted1.getFullYear(), 10) + 1);
			}
			var varFechaHabile1 = dateFormatted1.getFullYear() + "-" + varMesProximo1 + "-" + varMatrizDiasHabiles[0].CAMPO1;
			var varFecha1 = new Date(varFechaHabile1 + " 00:00:00");
			var varRespuesta = "";
			if (varFecha1 >= fechaUsu || dateFormatted1 > fechaUsu) {
				varRespuesta = "S";
			} else {
				varRespuesta = "N";
			}

			return varRespuesta;
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
							var varVersionUBLValidar = oModel2.getProperty("/cbc:UBLVersionID");

							/*var matrixCodTipoDoc = [];
							var vectorCodTipoDoc = {};
							var tblmatrixCodsTipoDocTodos = oModel.getProperty("/tipoValeIngreso");
							oModel.setProperty("/tipoValeIngresoTotal", tblmatrixCodsTipoDocTodos);
							var varValidarCodTipoDoc = oModel2.getProperty("/cbc:InvoiceTypeCode");
							if(varValidarCodTipoDoc === "07"){
								
							}*/

							var varMatrizDiasHabiles = oModel.getProperty("/listTablasODataDiasHabiles");
							var varOpcionValidarFacturaFechaEmision = "";
							if (varMatrizDiasHabiles[0].ESTADO === "X") {
								var varFecEmisionValidarFactura = oModel2.getProperty("/cbc:IssueDate");
								varOpcionValidarFacturaFechaEmision = this.validarFacturaFechaEmision(varFecEmisionValidarFactura);
							} else {
								varOpcionValidarFacturaFechaEmision = "S";
							}

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
							if (varOpcionValidarFacturaFechaEmision === "S") {
								oModelValDocIns.read("/" + this.varTableT_FAC + "?$format=json", {
									filters: filtersValDocIns,
									success: function (response) {
										var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
										var lenghtV = oModelJSON.getData().length;
										if (lenghtV === 0) { // quitar || lenghtV !== 0 20200304
											if (varVersionUBLValidar === "2.1") {
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
												var varDireccion = "";
												var varDireccion = oModel2.getProperty("/cac:AccountingCustomerParty/cac:Party/cac:PhysicalLocation/cbc:Description");
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
													/*if (varCodTipoDetraccion !== "") { // MAURO 20211014
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
													}*/

													// MAURO 20211014
													var oTblDetraccion = oModel.getProperty("/tblDetraccion");
													var oTblServDetraccion = oModel.getProperty("/tblServDetraccion");
													var oTblMatDetraccion = oModel.getProperty("/tblMatDetraccion");
													console.log(oTblDetraccion);
													console.log(oTblServDetraccion);
													console.log(oTblMatDetraccion);

													this.oGlobalCodTipoDetraccion = ""; // MAURO 20211014
													//this.oGlobalCodTipoDetraccion = "17"; // MAURO 20211014
													for (var i = 0; i < oTblDetraccion.length; i++) {
														console.log(oTblDetraccion[i].NUMTP + " - " + varCodTipoDetraccion);
														if (oTblDetraccion[i].NUMTP === varCodTipoDetraccion) {
															this.oGlobalCodTipoDetraccion = varCodTipoDetraccion;
														}
													}

													console.log(this.oGlobalCodTipoDetraccion);
													if (this.oGlobalCodTipoDetraccion === "") {
														varCodTipoDetraccion = "";
													}
													console.log(varCodTipoDetraccion);
													// MAURO 20211014

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
														llaveCabeceraFacLabel[11] = "Dirección";

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
														llaveCabeceraFacValue[11] = varDireccion;

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

																llaveDetalle.clistItemDetalleFacturaPosicion = varPosicion[j];
																llaveDetalle.clistItemDetalleFacturaEstado = "Sin Asignar";
																llaveDetalle.clistItemDetalleFacturaCodigo = varCodigo[j];
																llaveDetalle.clistItemDetalleFacturaDescripcion = varDescripcion[j].substring(0, 99);
																llaveDetalle.clistItemDetalleFacturaUniMedida = varUnidMedida[j];
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
															//var TotalIGV = oModel2.getProperty("/cac:TaxTotal/cac:TaxSubtotal/cbc:TaxAmount");

															//20201215
															var varBucleTaxSub = 0;
															var varConteoTaxSub = 0;
															while (varBucleTaxSub <= 4) {
																try {
																	oModel2.getProperty("/cac:TaxTotal/cac:TaxSubtotal/" + varConteoTaxSub + "/cbc:TaxAmount");
																	varConteoTaxSub++;
																} catch (error) {}
																varBucleTaxSub++;
															}

															var varPosicionTipoDeImpuesto = 0;
															var varOpceEncontrado = "N";
															for (var i = 0; i < varConteoTaxSub; i++) {
																var varTipoDeImpuesto = oModel2.getProperty("/cac:TaxTotal/cac:TaxSubtotal/" + i +
																	"/cac:TaxCategory/cac:TaxScheme/cbc:Name");
																if (varTipoDeImpuesto === "IGV") {
																	varPosicionTipoDeImpuesto = i;
																	varOpceEncontrado = "S";
																}
															}

															var TotalIGV = "";
															if (varOpceEncontrado === "S") {
																TotalIGV = oModel2.getProperty("/cac:TaxTotal/cac:TaxSubtotal/" + varPosicionTipoDeImpuesto + "/cbc:TaxAmount");
															} else {
																TotalIGV = "0.00";
															}
															//20201215

															var varTotatlSinIGV = parseFloat(varImporteTotal, 10) - parseFloat(TotalIGV, 10);

															this.getView().byId("idTotalDescuentos").setValue("     " + varTotalDescuentos);
															this.getView().byId("idTotalIGV").setValue("     " + varTotalIGV);
															this.getView().byId("idImporteTotal").setValue("     " + varImporteTotal);
															this.getView().byId("idImporteTotalIGV").setValue("     " + varTotatlSinIGV.toFixed(2));

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
															this.getView().byId("idAsignar").setEnabled(true);

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

																}.bind(this)
															}),
															afterClose: function () {
																dialog.destroy();
															}
														});

														dialog.open();
													}
												} else {
													this.limpiarPantalla();
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

															}.bind(this)
														}),
														afterClose: function () {
															dialog.destroy();
														}
													});

													dialog.open();
												}
												///////////////////////////////////////////////////////////////////////////////
											} else {
												var dialogValDocUBL = new sap.m.Dialog({
													title: "Error factura",
													type: "Message",
													state: "Error",
													icon: "sap-icon://error",
													content: new sap.m.Text({
														text: "La versión UBL de la factura que intenta cargar " + varVersionUBLValidar +
															" no corresponde a la versión válida indicada por SUNAT (2.1)"
													}),
													beginButton: new sap.m.Button({
														text: "Aceptar",
														press: function () {
															dialogValDocUBL.close();
															dialogValDocUBL.destroy();
														}.bind(this)
													}),
													afterClose: function () {
														dialogValDocUBL.destroy();
													}
												});
												dialogValDocUBL.open();
											}

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
													}.bind(this)
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
							} else {
								var dialog = new sap.m.Dialog({
									title: "Mensaje de error",
									type: "Message",
									state: "Warning",
									icon: "sap-icon://error",
									content: new sap.m.Text({
										text: "La factura no puede ser cargada, la fecha de emisión es muy antigua."
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
							}
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

		//Begin I@MM-16/12/2021-Ticket-2021-999
		validarFacturaFechaEmisionDC: function (varFechaEmision) {

			var oModel = this.getView().getModel("myParam");
			var varMatrizDiasHabiles = oModel.getProperty("/listTablasODataDiasCalendario");
			console.log(varMatrizDiasHabiles);

			var fechaUsu = new Date();
			fechaUsu.setHours(0, 0, 0, 0);

			var dia = varFechaEmision.substring(8, 10);
			var mes = varFechaEmision.substring(5, 7);
			var anio = varFechaEmision.substring(0, 4);

			varFechaEmision = anio + "-" + mes + "-" + dia;
			console.log(varFechaEmision);

			var dateFormatted1 = new Date(varFechaEmision + " 00:00:00");
			var dateFormatted4 = dateFormatted1;
			console.log(dateFormatted4);

			//var dateFormatted2 = this.funSumarDias(dateFormatted1, parseInt(varMatrizDiasHabiles[0].CAMPO1, 10));

			var varRespuesta = "";
			if (dateFormatted4.getTime() <= fechaUsu.getTime() && fechaUsu.getTime() <= this.funSumarDias(dateFormatted1, parseInt(
					varMatrizDiasHabiles[0].CAMPO1, 10)).getTime()) {
				varRespuesta = "S";
			} else {
				varRespuesta = "N";
			}

			return varRespuesta;
		},

		funSumarDias: function (oFecha, oDias) {

			oFecha.setDate(oFecha.getDate() + oDias);
			return oFecha;
		},
		//End I@MM-16/12/2021-Ticket-2021-999

		efectuarCargaFileXML2: function () {
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

							var varNumFacturaValid = "";
							var varNumFacturaValid1 = oModel2.getProperty("/cbc:ID");
							var varNumFacturaValid2 = oModel2.getProperty("/n2:ID");
							if (varNumFacturaValid1 !== "") {
								varNumFacturaValid = varNumFacturaValid1;
							} else if (varNumFacturaValid2 !== "") {
								varNumFacturaValid = varNumFacturaValid2;
							}
							var varVersionUBLValidar = "";
							var varVersionUBLValidar1 = oModel2.getProperty("/cbc:UBLVersionID");
							var varVersionUBLValidar2 = oModel2.getProperty("/n2:UBLVersionID");
							if (varVersionUBLValidar1 !== "") {
								varVersionUBLValidar = varVersionUBLValidar1;
							} else if (varVersionUBLValidar2 !== "") {
								varVersionUBLValidar = varVersionUBLValidar2;
							}
							
							//Begin I@MM-24/12/2021-Ticket-2021-525
							var varVersionFormaPagoValidar = "";
							var varVersionFormaPagoValidar1 = oModel2.getProperty("/cac:PaymentTerms/0/cbc:PaymentMeansID");
							console.log(varVersionFormaPagoValidar1);
							if (varVersionFormaPagoValidar1 !== "") {
								varVersionFormaPagoValidar = varVersionFormaPagoValidar1;
							}
							//End I@MM-24/12/2021-Ticket-2021-525

							/*var matrixCodTipoDoc = [];
							var vectorCodTipoDoc = {};
							var tblmatrixCodsTipoDocTodos = oModel.getProperty("/tipoValeIngreso");
							oModel.setProperty("/tipoValeIngresoTotal", tblmatrixCodsTipoDocTodos);
							var varValidarCodTipoDoc = oModel2.getProperty("/cbc:InvoiceTypeCode");
							if(varValidarCodTipoDoc === "07"){
								
							}*/

							var varMatrizDiasHabiles = oModel.getProperty("/listTablasODataDiasHabiles");
							var varOpcionValidarFacturaFechaEmision = "";
							if (varMatrizDiasHabiles[0].ESTADO === "X") {

								var varFecEmisionValidarFactura = "";
								var varFecEmisionValidarFactura1 = oModel2.getProperty("/cbc:IssueDate");
								var varFecEmisionValidarFactura2 = oModel2.getProperty("/n2:IssueDate");
								if (varFecEmisionValidarFactura1 !== "") {
									varFecEmisionValidarFactura = varFecEmisionValidarFactura1;
								} else if (varFecEmisionValidarFactura2 !== "") {
									varFecEmisionValidarFactura = varFecEmisionValidarFactura2;
								}

								varOpcionValidarFacturaFechaEmision = this.validarFacturaFechaEmision(varFecEmisionValidarFactura);
							} else {
								varOpcionValidarFacturaFechaEmision = "S";
							}

							//Begin I@MM-16/12/2021-Ticket-2021-999
							var varMatrizDiasCalendario = oModel.getProperty("/listTablasODataDiasCalendario");
							console.log(varMatrizDiasCalendario);
							var varOpcionValidarFacturaFechaEmisionDC = "";
							if (varMatrizDiasCalendario[0].ESTADO === "X") {

								var varFecEmisionValidarFacturaDC = "";
								var varFecEmisionValidarFacturaDC1 = oModel2.getProperty("/cbc:IssueDate");
								var varFecEmisionValidarFacturaDC2 = oModel2.getProperty("/n2:IssueDate");
								if (varFecEmisionValidarFacturaDC1 !== "") {
									varFecEmisionValidarFacturaDC = varFecEmisionValidarFacturaDC1;
								} else if (varFecEmisionValidarFacturaDC2 !== "") {
									varFecEmisionValidarFacturaDC = varFecEmisionValidarFacturaDC2;
								}

								varOpcionValidarFacturaFechaEmisionDC = this.validarFacturaFechaEmisionDC(varFecEmisionValidarFacturaDC);
							} else {
								varOpcionValidarFacturaFechaEmisionDC = "S";
							}
							console.log(varOpcionValidarFacturaFechaEmisionDC);
							//End I@MM-16/12/2021-Ticket-2021-999

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
							if (varVersionFormaPagoValidar !== "") { //I@MM-24/12/2021-Ticket-2021-525
								if (varOpcionValidarFacturaFechaEmisionDC === "S") { //I@MM-16/12/2021-Ticket-2021-999
									if (varOpcionValidarFacturaFechaEmision === "S") {
										oModelValDocIns.read("/" + this.varTableT_FAC + "?$format=json", {
											filters: filtersValDocIns,
											success: function (response) {
												var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
												var lenghtV = oModelJSON.getData().length;
												if (lenghtV === 0) { // quitar || lenghtV !== 0 20200304
													if (varVersionUBLValidar === "2.1") {
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
	
														var varVersionUBL = "";
														var varVersionUBL1 = oModel2.getProperty("/cbc:UBLVersionID");
														var varVersionUBL2 = oModel2.getProperty("/n2:UBLVersionID");
														if (varVersionUBL1 !== "") {
															varVersionUBL = varVersionUBL1;
														} else if (varVersionUBL2 !== "") {
															varVersionUBL = varVersionUBL2;
														}
	
														var varNumFactura = "";
														var varNumFactura1 = oModel2.getProperty("/cbc:ID");
														var varNumFactura2 = oModel2.getProperty("/n2:ID");
														if (varNumFactura1 !== "") {
															varNumFactura = varNumFactura1;
														} else if (varNumFactura2 !== "") {
															varNumFactura = varNumFactura2;
														}
	
														var varFecEmision = "";
														var varFecEmision1 = oModel2.getProperty("/cbc:IssueDate");
														var varFecEmision2 = oModel2.getProperty("/n2:IssueDate");
														if (varFecEmision1 !== "") {
															varFecEmision = varFecEmision1;
														} else if (varFecEmision2 !== "") {
															varFecEmision = varFecEmision2;
														}
	
														var varDireccion = "";
														var varDireccion = oModel2.getProperty("/cac:AccountingCustomerParty/cac:Party/cac:PhysicalLocation/cbc:Description");
	
														//var varEmiRazonSocial = oModel2.getProperty("/cac:Signature/cac:SignatoryParty/cac:PartyName/cbc:Name");
														var varEmiRazonSocial = "";
														var varEmiRazonSocial1 = oModel2.getProperty(
															"/cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName");
														var varEmiRazonSocial2 = oModel2.getProperty("/cac:Signature/cac:SignatoryParty/cac:PartyName/cbc:Name");
														var varEmiRazonSocial3 = oModel2.getProperty(
															"/cac:AccountingSupplierParty/n5:Party/n5:PartyLegalEntity/n4:RegistrationName");
														var varEmiRazonSocial4 = oModel2.getProperty(
															"/cac:AccountingSupplierParty/n1:Party/n1:PartyLegalEntity/n2:RegistrationName");
														if (varEmiRazonSocial1 !== "") {
															varEmiRazonSocial = varEmiRazonSocial1;
														} else if (varEmiRazonSocial2 !== "") {
															varEmiRazonSocial = varEmiRazonSocial2;
														} else if (varEmiRazonSocial3 !== "") {
															varEmiRazonSocial = varEmiRazonSocial3;
														} else if (varEmiRazonSocial4 !== "") {
															varEmiRazonSocial = varEmiRazonSocial4;
														}
	
														//var varNomComercial = oModel2.getProperty("/cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name");
														var varNomComercial = "";
														var varNomComercial1 = oModel2.getProperty("/cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name");
														var varNomComercial2 = oModel2.getProperty("/cac:AccountingSupplierParty/n5:Party/n5:PartyName/n4:Name");
														var varNomComercial3 = oModel2.getProperty("/cac:AccountingSupplierParty/n1:Party/n1:PartyName/n2:Name");
														if (varNomComercial1 !== "") {
															varNomComercial = varNomComercial1;
														} else if (varNomComercial2 !== "") {
															varNomComercial = varNomComercial2;
														} else if (varNomComercial3 !== "") {
															varNomComercial = varNomComercial3;
														}
	
														var varRUCEmisor = "";
														var rucEmisor1 = oModel2.getProperty("/cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/CompanyID");
														var rucEmisor2 = oModel2.getProperty("/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification/cbc:ID");
														var rucEmisor3 = oModel2.getProperty("/cac:AccountingSupplierParty/cbc:CustomerAssignedAccountID");
														var rucEmisor4 = oModel2.getProperty("/cac:AccountingSupplierParty/n1:Party/n1:PartyIdentification/n2:ID");
														if (rucEmisor1.toString().trim() !== "") {
															varRUCEmisor = rucEmisor1;
														} else if (rucEmisor2.toString().trim() !== "") {
															varRUCEmisor = rucEmisor2;
														} else if (rucEmisor3.toString().trim() !== "") {
															varRUCEmisor = rucEmisor3;
														} else if (rucEmisor4.toString().trim() !== "") {
															varRUCEmisor = rucEmisor4;
														} else {
															varRUCEmisor = "";
														}
	
														if (varRUCEmisor.trim().toString() === usuarioLogin.trim().toString()) {
	
															//var varCodTipoDoc = oModel2.getProperty("/cbc:InvoiceTypeCode");
															var varCodTipoDoc = "";
															var varCodTipoDoc1 = oModel2.getProperty("/cbc:InvoiceTypeCode");
															var varCodTipoDoc2 = oModel2.getProperty("/n4:InvoiceTypeCode");
															var varCodTipoDoc3 = oModel2.getProperty("/n2:InvoiceTypeCode");
															if (varCodTipoDoc1 !== "") {
																varCodTipoDoc = varCodTipoDoc1;
															} else if (varCodTipoDoc2 !== "") {
																varCodTipoDoc = varCodTipoDoc2;
															} else if (varCodTipoDoc3 !== "") {
																varCodTipoDoc = varCodTipoDoc3;
															}
	
															//var varCodTipoDetraccion = oModel2.getProperty("/cac:PaymentMeans/cbc:PaymentMeansCode");
															var varCodTipoDetraccion = oModel2.getProperty("/cac:PaymentTerms/cbc:PaymentMeansID");
															/*if (varCodTipoDetraccion !== "") { // MAURO 20211014
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
															}*/
	
															// MAURO 20211014
															var oTblDetraccion = oModel.getProperty("/tblDetraccion");
															var oTblServDetraccion = oModel.getProperty("/tblServDetraccion");
															var oTblMatDetraccion = oModel.getProperty("/tblMatDetraccion");
															console.log(oTblDetraccion);
															console.log(oTblServDetraccion);
															console.log(oTblMatDetraccion);
	
															this.oGlobalCodTipoDetraccion = ""; // MAURO 20211014
															//this.oGlobalCodTipoDetraccion = "17"; // MAURO 20211014
															for (var i = 0; i < oTblDetraccion.length; i++) {
																console.log(oTblDetraccion[i].NUMTP + " - " + varCodTipoDetraccion);
																if (oTblDetraccion[i].NUMTP === varCodTipoDetraccion) {
																	this.oGlobalCodTipoDetraccion = varCodTipoDetraccion;
																}
															}
	
															console.log(this.oGlobalCodTipoDetraccion);
															if (this.oGlobalCodTipoDetraccion === "") {
																varCodTipoDetraccion = "";
															}
															console.log(varCodTipoDetraccion);
															// MAURO 20211014
	
															var varRUCReceptor = "";
															var rucReceptor1 = oModel2.getProperty("/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/CompanyID");
															var rucReceptor2 = oModel2.getProperty("/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID");
															var rucReceptor3 = oModel2.getProperty("/cac:AccountingCustomerParty/cbc:CustomerAssignedAccountID");
															var rucReceptor4 = oModel2.getProperty("/n1:AccountingCustomerParty/n1:Party/n1:PartyIdentification/n2:ID");
															if (rucReceptor1.toString().trim() !== "") {
																varRUCReceptor = rucReceptor1;
															} else if (rucReceptor2.toString().trim() !== "") {
																varRUCReceptor = rucReceptor2;
															} else if (rucReceptor3.toString().trim() !== "") {
																varRUCReceptor = rucReceptor3;
															} else if (rucReceptor4.toString().trim() !== "") {
																varRUCReceptor = rucReceptor4;
															} else {
																varRUCReceptor = "";
															}
	
															if (varRUCReceptor === usuarioRuc) {
	
																var varRecRazonSocial = "";
																var recRazonSocial1 = oModel2.getProperty(
																	"/cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cbc:RegistrationName");
																var recRazonSocial2 = oModel2.getProperty(
																	"/cac:AccountingCustomerParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName");
																var recRazonSocial3 = oModel2.getProperty(
																	"/n1:AccountingCustomerParty/n1:Party/n1:PartyLegalEntity/n2:RegistrationName");
																if (recRazonSocial1.toString().trim() !== "") {
																	varRecRazonSocial = recRazonSocial1;
																} else if (recRazonSocial2.toString().trim() !== "") {
																	varRecRazonSocial = recRazonSocial2;
																} else if (recRazonSocial3.toString().trim() !== "") {
																	varRecRazonSocial = recRazonSocial3;
																} else {
																	varRecRazonSocial = "";
																}
	
																//var varMoneda = oModel2.getProperty("/cbc:DocumentCurrencyCode");
																var varMoneda = "";
																var varMoneda1 = oModel2.getProperty("/cbc:DocumentCurrencyCode");
																var varMoneda2 = oModel2.getProperty("/n4:DocumentCurrencyCode");
																var varMoneda3 = oModel2.getProperty("/n2:DocumentCurrencyCode");
																if (varMoneda1 !== "") {
																	varMoneda = varMoneda1;
																} else if (varMoneda2 !== "") {
																	varMoneda = varMoneda2;
																} else if (varMoneda3 !== "") {
																	varMoneda = varMoneda3;
																}
	
																//////////////////////////////////////////////////////////////////////////7
																//var varCabeTotalImporte = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:PayableAmount");
																var varCabeTotalImporte = "";
																var varCabeTotalImporte1 = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:PayableAmount");
																var varCabeTotalImporte2 = oModel2.getProperty("/n5:LegalMonetaryTotal/n4:PayableAmount");
																var varCabeTotalImporte3 = oModel2.getProperty("/n1:LegalMonetaryTotal/n2:PayableAmount");
																if (varCabeTotalImporte1 !== "") {
																	varCabeTotalImporte = varCabeTotalImporte1;
																} else if (varCabeTotalImporte2 !== "") {
																	varCabeTotalImporte = varCabeTotalImporte2;
																} else if (varCabeTotalImporte3 !== "") {
																	varCabeTotalImporte = varCabeTotalImporte3;
																}
	
																//var varCabeTotalIGV = oModel2.getProperty("/cac:TaxTotal/cbc:TaxAmount");
																var varCabeTotalIGV = "";
																var varCabeTotalIGV1 = oModel2.getProperty("/cac:TaxTotal/cbc:TaxAmount");
																var varCabeTotalIGV2 = oModel2.getProperty("/n5:TaxTotal/n4:TaxAmount");
																var varCabeTotalIGV3 = oModel2.getProperty("/n1:TaxTotal/n2:TaxAmount");
																if (varCabeTotalIGV1 !== "") {
																	varCabeTotalIGV = varCabeTotalIGV1;
																} else if (varCabeTotalIGV2 !== "") {
																	varCabeTotalIGV = varCabeTotalIGV2;
																} else if (varCabeTotalIGV3 !== "") {
																	varCabeTotalIGV = varCabeTotalIGV3;
																}
	
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
																llaveCabeceraFacLabel[11] = "Dirección";
	
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
																llaveCabeceraFacValue[11] = varDireccion;
	
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
																var textoVariableCodigo = "";
																var InvoiceLine = oModel2.getProperty("/cac:InvoiceLine");
																var CreditNoteLine = oModel2.getProperty("/cac:CreditNoteLine");
																var InvoiceLine2 = oModel2.getProperty("/n5:InvoiceLine");
																var InvoiceLine3 = oModel2.getProperty("/n1:InvoiceLine");
																if (InvoiceLine.toString().trim() !== "") {
																	texto = "/cac:InvoiceLine";
																	textoVariable = "/cbc:InvoicedQuantity";
																	textoVariableCodigo = "1";
																} else if (CreditNoteLine.toString().trim() !== "") {
																	texto = "/cac:CreditNoteLine";
																	textoVariable = "/cbc:CreditedQuantity";
																	textoVariableCodigo = "1";
																} else if (InvoiceLine2.toString().trim() !== "") {
																	texto = "/n5:InvoiceLine";
																	textoVariable = "/n4:InvoicedQuantity";
																	textoVariableCodigo = "2";
																} else if (InvoiceLine3.toString().trim() !== "") {
																	texto = "/n1:InvoiceLine";
																	textoVariable = "/n2:InvoicedQuantity";
																	textoVariableCodigo = "3";
																} else {
																	realizar = false;
																}
	
																if (realizar) {
																	while (cont === 1) {
																		try {
																			if (textoVariableCodigo === "1") {
																				oModel2.getProperty(texto + "/" + tamDetalleFactura + "/cbc:ID");
																			} else if (textoVariableCodigo === "2") {
																				oModel2.getProperty(texto + "/" + tamDetalleFactura + "/n4:ID");
																			} else if (textoVariableCodigo === "3") {
																				oModel2.getProperty(texto + "/" + tamDetalleFactura + "/n2:ID");
																			}
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
																	var valor3Codigo = "";
																	var valor4Codigo = "";
																	var descripcionTotal = "";
																	var var1PorcentajeVal = "";
																	var var2PorcentajeVal = "";
																	for (var j = 0; j < tamDetalleFactura; j++) {
																		llaveDetalle = {};
	
																		//varPosicion[j] = oModel2.getProperty(texto + "/" + j + "/cbc:ID");
																		var varPosicionD = "";
																		var varPosicionD1 = oModel2.getProperty(texto + "/" + j + "/cbc:ID");
																		var varPosicionD2 = oModel2.getProperty(texto + "/" + j + "/n2:ID");
																		var varPosicionD3 = oModel2.getProperty(texto + "/" + j + "/n4:ID");
																		if (varPosicionD1 !== "") {
																			varPosicionD = varPosicionD1;
																		} else if (varPosicionD2 !== "") {
																			varPosicionD = varPosicionD2;
																		} else if (varPosicionD3 !== "") {
																			varPosicionD = varPosicionD3;
																		}
																		varPosicion[j] = varPosicionD;
	
																		valor1Codigo = oModel2.getProperty(texto + "/" + j + "/cac:Item/cac:SellersItemIdentification/cbc:ID");
																		valor2Codigo = oModel2.getProperty(texto + "/" + j + "/cac:Item/cac:AdditionalItemProperty/cbc:Value");
																		valor3Codigo = oModel2.getProperty(texto + "/" + j + "/n5:Item/n5:SellersItemIdentification/n4:ID");
																		valor4Codigo = oModel2.getProperty(texto + "/" + j + "/n1:Item/n1:SellersItemIdentification/n2:ID");
																		if (valor1Codigo.toString().trim() !== "") {
																			varCodigo[j] = valor1Codigo;
																		} else if (valor2Codigo.toString().trim() !== "") {
																			varCodigo[j] = valor2Codigo;
																		} else if (valor3Codigo.toString().trim() !== "") {
																			varCodigo[j] = valor3Codigo;
																		} else if (valor4Codigo.toString().trim() !== "") {
																			varCodigo[j] = valor4Codigo;
																		} else {
																			varCodigo[j] = "";
																		}
	
																		//varDescripcion[j] = oModel2.getProperty(texto + "/" + j + "/cac:Item/cbc:Description");
																		var varDescripcionD1 = oModel2.getProperty(texto + "/" + j + "/cac:Item/cbc:Description");
																		var varDescripcionD2 = oModel2.getProperty(texto + "/" + j + "/n5:Item/n4:Description");
																		var varDescripcionD3 = oModel2.getProperty(texto + "/" + j + "/n1:Item/n2:Description");
																		if (varDescripcionD1.toString().trim() !== "") {
																			varDescripcion[j] = varDescripcionD1;
																		} else if (varDescripcionD2.toString().trim() !== "") {
																			varDescripcion[j] = varDescripcionD2;
																		} else if (varDescripcionD3.toString().trim() !== "") {
																			varDescripcion[j] = varDescripcionD3;
																		} else {
																			varDescripcion[j] = "";
																		}
	
																		//descripcionTotal = oModel2.getProperty(texto + "/" + j + "/cac:Item/cac:AdditionalItemProperty/cbc:Name");
																		var descripcionTotalD1 = oModel2.getProperty(texto + "/" + j + "/cac:Item/cac:AdditionalItemProperty/cbc:Name");
																		var descripcionTotalD2 = oModel2.getProperty(texto + "/" + j + "/n5:Item/cac:AdditionalItemProperty/cbc:Name");
																		if (descripcionTotalD1.toString().trim() !== "") {
																			descripcionTotal = descripcionTotalD1;
																		} else if (descripcionTotalD2.toString().trim() !== "") {
																			descripcionTotal = descripcionTotalD2;
																		} else {
																			descripcionTotal = "";
																		}
	
																		if (descripcionTotal.toString().trim() !== "") {
																			varDescripcion[j] = varDescripcion[j] + " - " + descripcionTotal;
																		}
	
																		varUnidMedida[j] = oModel2.getProperty(texto + "/" + j + textoVariable + "/@unitCode");
	
																		varCantidad[j] = oModel2.getProperty(texto + "/" + j + textoVariable);
	
																		//varAfectacionIGV[j] = oModel2.getProperty(texto + "/" + j + "/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:Name");
																		var varAfectacionIGVD1 = oModel2.getProperty(texto + "/" + j +
																			"/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:Name");
																		var varAfectacionIGVD2 = oModel2.getProperty(texto + "/" + j +
																			"/n5:TaxTotal/n5:TaxSubtotal/n5:TaxCategory/n5:TaxScheme/n4:Name");
																		var varAfectacionIGVD3 = oModel2.getProperty(texto + "/" + j +
																			"/n1:TaxTotal/n1:TaxSubtotal/n1:TaxCategory/n1:TaxScheme/n2:Name");
																		if (varAfectacionIGVD1.toString().trim() !== "") {
																			varAfectacionIGV[j] = varAfectacionIGVD1;
																		} else if (varAfectacionIGVD2.toString().trim() !== "") {
																			varAfectacionIGV[j] = varAfectacionIGVD2;
																		} else if (varAfectacionIGVD3.toString().trim() !== "") {
																			varAfectacionIGV[j] = varAfectacionIGVD3;
																		} else {
																			varAfectacionIGV[j] = "";
																		}
	
																		//varPrecioUnitxItem[j] = oModel2.getProperty(texto + "/" + j + "/cac:Price/cbc:PriceAmount");
																		var varPrecioUnitxItemD1 = oModel2.getProperty(texto + "/" + j + "/cac:Price/cbc:PriceAmount");
																		var varPrecioUnitxItemD2 = oModel2.getProperty(texto + "/" + j + "/n5:Price/n4:PriceAmount");
																		var varPrecioUnitxItemD3 = oModel2.getProperty(texto + "/" + j + "/n1:Price/n2:PriceAmount");
																		if (varPrecioUnitxItemD1.toString().trim() !== "") {
																			varPrecioUnitxItem[j] = varPrecioUnitxItemD1;
																		} else if (varPrecioUnitxItemD2.toString().trim() !== "") {
																			varPrecioUnitxItem[j] = varPrecioUnitxItemD2;
																		} else if (varPrecioUnitxItemD3.toString().trim() !== "") {
																			varPrecioUnitxItem[j] = varPrecioUnitxItemD3;
																		} else {
																			varPrecioUnitxItem[j] = "";
																		}
	
																		//varPrecioVentaxItem[j] = oModel2.getProperty(texto + "/" + j + "/cac:PricingReference/cac:AlternativeConditionPrice/cbc:PriceAmount");
																		var varPrecioVentaxItemD1 = oModel2.getProperty(texto + "/" + j +
																			"/cac:PricingReference/cac:AlternativeConditionPrice/cbc:PriceAmount");
																		var varPrecioVentaxItemD2 = oModel2.getProperty(texto + "/" + j +
																			"/n5:PricingReference/n5:AlternativeConditionPrice/n4:PriceAmount");
																		var varPrecioVentaxItemD3 = oModel2.getProperty(texto + "/" + j +
																			"/n1:PricingReference/n1:AlternativeConditionPrice/n2:PriceAmount");
																		if (varPrecioVentaxItemD1.toString().trim() !== "") {
																			varPrecioVentaxItem[j] = varPrecioVentaxItemD1;
																		} else if (varPrecioVentaxItemD2.toString().trim() !== "") {
																			varPrecioVentaxItem[j] = varPrecioVentaxItemD2;
																		} else if (varPrecioVentaxItemD3.toString().trim() !== "") {
																			varPrecioVentaxItem[j] = varPrecioVentaxItemD3;
																		} else {
																			varPrecioVentaxItem[j] = "";
																		}
	
																		//varTotalIGVxItem[j] = oModel2.getProperty(texto + "/" + j + "/cac:TaxTotal/cbc:TaxAmount");
																		var varTotalIGVxItemD1 = oModel2.getProperty(texto + "/" + j + "/cac:TaxTotal/cbc:TaxAmount");
																		var varTotalIGVxItemD2 = oModel2.getProperty(texto + "/" + j + "/n5:TaxTotal/n4:TaxAmount");
																		var varTotalIGVxItemD3 = oModel2.getProperty(texto + "/" + j + "/n1:TaxTotal/n2:TaxAmount");
																		if (varTotalIGVxItemD1.toString().trim() !== "") {
																			varTotalIGVxItem[j] = varTotalIGVxItemD1;
																		} else if (varTotalIGVxItemD2.toString().trim() !== "") {
																			varTotalIGVxItem[j] = varTotalIGVxItemD2;
																		} else if (varTotalIGVxItemD3.toString().trim() !== "") {
																			varTotalIGVxItem[j] = varTotalIGVxItemD3;
																		} else {
																			varTotalIGVxItem[j] = "";
																		}
	
																		//varValorVentaxItem[j] = oModel2.getProperty(texto + "/" + j + "/cbc:LineExtensionAmount");
																		var varValorVentaxItemD1 = oModel2.getProperty(texto + "/" + j + "/cbc:LineExtensionAmount");
																		var varValorVentaxItemD2 = oModel2.getProperty(texto + "/" + j + "/n2:LineExtensionAmount");
																		if (varValorVentaxItemD1.toString().trim() !== "") {
																			varValorVentaxItem[j] = varValorVentaxItemD1;
																		} else if (varValorVentaxItemD2.toString().trim() !== "") {
																			varValorVentaxItem[j] = varValorVentaxItemD2;
																		} else {
																			varValorVentaxItem[j] = "";
																		}
	
																		varValortotalNetoXItem[j] = parseFloat(varTotalIGVxItem[j], 10) + parseFloat(varValorVentaxItem[j], 10);
	
																		//var1PorcentajeVal = oModel2.getProperty(texto + "/" + j + "/cac:TaxTotal/cac:TaxSubtotal/cbc:Percent");
																		var var1PorcentajeValD1 = oModel2.getProperty(texto + "/" + j + "/cac:TaxTotal/cac:TaxSubtotal/cbc:Percent");
																		var var1PorcentajeValD2 = oModel2.getProperty(texto + "/" + j +
																			"/n5:TaxTotal/n5:TaxSubtotal/n5:TaxCategory/n4:Percent");
																		var var1PorcentajeValD3 = oModel2.getProperty(texto + "/" + j +
																			"/n1:TaxTotal/n1:TaxSubtotal/n1:TaxCategory/n2:Percent");
																		var var1PorcentajeValD4 = oModel2.getProperty(texto + "/" + j +
																			"/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cbc:Percent");
																		if (var1PorcentajeValD1.toString().trim() !== "") {
																			varValorPorcentajeIGV[j] = var1PorcentajeValD1;
																		} else if (var1PorcentajeValD2.toString().trim() !== "") {
																			varValorPorcentajeIGV[j] = var1PorcentajeValD2;
																		} else if (var1PorcentajeValD3.toString().trim() !== "") {
																			varValorPorcentajeIGV[j] = var1PorcentajeValD3;
																		} else if (var1PorcentajeValD4.toString().trim() !== "") {
																			varValorPorcentajeIGV[j] = var1PorcentajeValD4;
																		} else {
																			varValorPorcentajeIGV[j] = "0.00";
																		}
	
																		/*var2PorcentajeVal = oModel2.getProperty(texto + "/" + j + "/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cbc:Percent");
																		
																		if (var1PorcentajeVal.toString().trim() !== "") {
																			varValorPorcentajeIGV[j] = var1PorcentajeVal;
																		} else if (var2PorcentajeVal.toString().trim() !== "") {
																			varValorPorcentajeIGV[j] = var2PorcentajeVal;
																		} else {
																			varValorPorcentajeIGV[j] = "0.00";
																		}*/
	
																		llaveDetalle.clistItemDetalleFacturaPosicion = varPosicion[j];
																		llaveDetalle.clistItemDetalleFacturaEstado = "Sin Asignar";
																		llaveDetalle.clistItemDetalleFacturaCodigo = varCodigo[j];
																		llaveDetalle.clistItemDetalleFacturaDescripcion = varDescripcion[j].substring(0, 99);
																		llaveDetalle.clistItemDetalleFacturaUniMedida = varUnidMedida[j];
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
																	//var varTotalDescuentos = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount");
																	var varTotalDescuentos = "";
																	var varTotalDescuentos1 = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount");
																	var varTotalDescuentos2 = oModel2.getProperty("/n5:LegalMonetaryTotal/cbc:AllowanceTotalAmount");
																	if (varTotalDescuentos1.toString().trim() !== "") {
																		varTotalDescuentos = varTotalDescuentos1;
																	} else if (varTotalDescuentos2.toString().trim() !== "") {
																		varTotalDescuentos = varTotalDescuentos2;
																	} else {
																		varTotalDescuentos = "0.00";
																	}
	
																	//var varTotalIGV = oModel2.getProperty("/cac:TaxTotal/cbc:TaxAmount");
																	var varTotalIGV = "";
																	var varTotalIGV1 = oModel2.getProperty("/cac:TaxTotal/cbc:TaxAmount");
																	var varTotalIGV2 = oModel2.getProperty("/n5:TaxTotal/n4:TaxAmount");
																	var varTotalIGV3 = oModel2.getProperty("/n1:TaxTotal/n2:TaxAmount");
																	if (varTotalIGV1.toString().trim() !== "") {
																		varTotalIGV = varTotalIGV1;
																	} else if (varTotalIGV2.toString().trim() !== "") {
																		varTotalIGV = varTotalIGV2;
																	} else if (varTotalIGV3.toString().trim() !== "") {
																		varTotalIGV = varTotalIGV3;
																	} else {
																		varTotalIGV = "0.00";
																	}
	
																	//var varImporteTotal = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:PayableAmount");
																	var varImporteTotal = "";
																	var varImporteTotal1 = oModel2.getProperty("/cac:LegalMonetaryTotal/cbc:PayableAmount");
																	var varImporteTotal2 = oModel2.getProperty("/n5:LegalMonetaryTotal/n4:PayableAmount");
																	var varImporteTotal3 = oModel2.getProperty("/n1:LegalMonetaryTotal/n2:PayableAmount");
																	if (varImporteTotal1.toString().trim() !== "") {
																		varImporteTotal = varImporteTotal1;
																	} else if (varImporteTotal2.toString().trim() !== "") {
																		varImporteTotal = varImporteTotal2;
																	} else if (varImporteTotal3.toString().trim() !== "") {
																		varImporteTotal = varImporteTotal3;
																	} else {
																		varImporteTotal = "0.00";
																	}
	
																	//var TotalIGV = oModel2.getProperty("/cac:TaxTotal/cac:TaxSubtotal/cbc:TaxAmount");
	
																	//20201215
																	var varBucleTaxSub = 0;
																	var varConteoTaxSub = 0;
																	if (textoVariableCodigo === "1") {
	
																		while (varBucleTaxSub <= 4) {
																			try {
																				oModel2.getProperty("/cac:TaxTotal/cac:TaxSubtotal/" + varConteoTaxSub + "/cbc:TaxAmount");
																				varConteoTaxSub++;
																			} catch (error) {}
																			varBucleTaxSub++;
																		}
	
																		var varPosicionTipoDeImpuesto = 0;
																		var varOpceEncontrado = "N";
																		for (var i = 0; i < varConteoTaxSub; i++) {
																			var varTipoDeImpuesto = oModel2.getProperty("/cac:TaxTotal/cac:TaxSubtotal/" + i +
																				"/cac:TaxCategory/cac:TaxScheme/cbc:Name");
																			if (varTipoDeImpuesto === "IGV") {
																				varPosicionTipoDeImpuesto = i;
																				varOpceEncontrado = "S";
																			}
																		}
	
																		var TotalIGV = "";
																		if (varOpceEncontrado === "S") {
																			TotalIGV = oModel2.getProperty("/cac:TaxTotal/cac:TaxSubtotal/" + varPosicionTipoDeImpuesto + "/cbc:TaxAmount");
																		} else {
																			TotalIGV = "0.00";
																		}
																	} else if (textoVariableCodigo === "2") {
	
																		while (varBucleTaxSub <= 4) {
																			try {
																				oModel2.getProperty("/n5:TaxTotal/n5:TaxSubtotal/" + varConteoTaxSub + "/n4:TaxAmount");
																				varConteoTaxSub++;
																			} catch (error) {}
																			varBucleTaxSub++;
																		}
	
																		var varPosicionTipoDeImpuesto = 0;
																		var varOpceEncontrado = "N";
																		for (var i = 0; i < varConteoTaxSub; i++) {
																			var varTipoDeImpuesto = oModel2.getProperty("/n5:TaxTotal/n5:TaxSubtotal/" + i +
																				"/n5:TaxCategory/n5:TaxScheme/n4:Name");
																			if (varTipoDeImpuesto === "IGV") {
																				varPosicionTipoDeImpuesto = i;
																				varOpceEncontrado = "S";
																			}
																		}
	
																		var TotalIGV = "";
																		if (varOpceEncontrado === "S") {
																			TotalIGV = oModel2.getProperty("/n5:TaxTotal/n5:TaxSubtotal/" + varPosicionTipoDeImpuesto + "/n4:TaxAmount");
																		} else {
																			TotalIGV = "0.00";
																		}
																	} else if (textoVariableCodigo === "3") {
	
																		while (varBucleTaxSub <= 4) {
																			try {
																				oModel2.getProperty("/n1:TaxTotal/n1:TaxSubtotal/" + varConteoTaxSub + "/n2:TaxAmount");
																				varConteoTaxSub++;
																			} catch (error) {}
																			varBucleTaxSub++;
																		}
	
																		var varPosicionTipoDeImpuesto = 0;
																		var varOpceEncontrado = "N";
																		for (var i = 0; i < varConteoTaxSub; i++) {
																			var varTipoDeImpuesto = oModel2.getProperty("/n1:TaxTotal/n1:TaxSubtotal/" + i +
																				"/n1:TaxCategory/n1:TaxScheme/n2:Name");
																			if (varTipoDeImpuesto === "IGV") {
																				varPosicionTipoDeImpuesto = i;
																				varOpceEncontrado = "S";
																			}
																		}
	
																		var TotalIGV = "";
																		if (varOpceEncontrado === "S") {
																			TotalIGV = oModel2.getProperty("/n1:TaxTotal/n1:TaxSubtotal/" + varPosicionTipoDeImpuesto + "/n2:TaxAmount");
																		} else {
																			TotalIGV = "0.00";
																		}
																	}
																	//20201215
	
																	var varTotatlSinIGV = parseFloat(varImporteTotal, 10) - parseFloat(TotalIGV, 10);
	
																	this.getView().byId("idTotalDescuentos").setValue("     " + varTotalDescuentos);
																	this.getView().byId("idTotalIGV").setValue("     " + varTotalIGV);
																	this.getView().byId("idImporteTotal").setValue("     " + varImporteTotal);
																	this.getView().byId("idImporteTotalIGV").setValue("     " + varTotatlSinIGV.toFixed(2));
																	this.getView().byId("idValorReferencial").setValue("     " + varTotatlSinIGV.toFixed(2)); //I@MM-21/12/2021-Ticket-2021-999
	
																	//I@MM-21/12/2021-Ticket-2021-999
																	oModel.setProperty("/valGlobalImporteTotalIGV", varTotatlSinIGV.toFixed(2));
																	var varSelecTipoCarga = this.getView().byId("idComboTipo").getSelectedItem().getKey();
																	if (varSelecTipoCarga === "H") {
																		console.log("H");
																		var oVectorlistServValReferencial = oModel.getProperty("/tblServDetraccion");
																		var oConteoMatServRef = 0;
																		for (var i = 0; i < vectorDetalleFactura.length; i++) {
																			for (var j = 0; j < oVectorlistServValReferencial.length; j++) {
																				if (vectorDetalleFactura[i].clistItemDetalleFacturaCodigo === oVectorlistServValReferencial[j].DE_NUM_SERVICIO && 
																				    oVectorlistServValReferencial[j].FLAG2 === "X") {
																					oConteoMatServRef++;
																				}
																			}
																		}
	
																		if (oConteoMatServRef > 0) {
																			this.metDialogValorReferencial();
																		}
																	} else if (varSelecTipoCarga === "S") {
																		console.log("S");
																	}
																	//D@MM-21/12/2021-Ticket-2021-999
	
																	// Validar la Factura con la Orden de Compra
	
																	sap.m.MessageToast.show("Se realizó la carga XML.");
																	this.validarSunat();
																	this.verificarAsignaciónPosFactura();
	
																	// Validar Documentos Adjuntos
																	var varTblTam = oModel.getProperty("/listTablaDocumentos").length;
																	if (varTblTam === 0) {
																		this.getView().byId("idValidacionDoc").setText(
																			"Se requiere asignar todos los Documentos Sustentos de la factura.");
																		this.getView().byId("idValidacionDoc").setType("Warning");
																	}
	
																	this.getView().byId("idAnadirDocSus").setEnabled(true);
																	this.getView().byId("idAsignar").setEnabled(true);
	
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
	
																		}.bind(this)
																	}),
																	afterClose: function () {
																		dialog.destroy();
																	}
																});
	
																dialog.open();
															}
														} else {
															this.limpiarPantalla();
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
	
																	}.bind(this)
																}),
																afterClose: function () {
																	dialog.destroy();
																}
															});
	
															dialog.open();
														}
														///////////////////////////////////////////////////////////////////////////////
													} else {
														var dialogValDocUBL = new sap.m.Dialog({
															title: "Error factura",
															type: "Message",
															state: "Error",
															icon: "sap-icon://error",
															content: new sap.m.Text({
																text: "La versión UBL de la factura que intenta cargar " + varVersionUBLValidar +
																	" no corresponde a la versión válida indicada por SUNAT (2.1)"
															}),
															beginButton: new sap.m.Button({
																text: "Aceptar",
																press: function () {
																	dialogValDocUBL.close();
																	dialogValDocUBL.destroy();
																}.bind(this)
															}),
															afterClose: function () {
																dialogValDocUBL.destroy();
															}
														});
														dialogValDocUBL.open();
													}
	
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
															}.bind(this)
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
									} else {
										var dialog = new sap.m.Dialog({
											title: "Mensaje de error",
											type: "Message",
											state: "Warning",
											icon: "sap-icon://error",
											content: new sap.m.Text({
												text: "La factura no puede ser cargada, la fecha de emisión es muy antigua."
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
									}
								} else {
									var dialog = new sap.m.Dialog({
										title: "Mensaje de error",
										type: "Message",
										state: "Warning",
										icon: "sap-icon://error",
										content: new sap.m.Text({
											text: "La factura no puede ser cargada, la fecha de emisión paso el límite de días calendario."
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
								}
							} else {
								var dialog = new sap.m.Dialog({
									title: "Mensaje de error",
									type: "Message",
									state: "Warning",
									icon: "sap-icon://error",
									content: new sap.m.Text({
										text: "No existe forma de pago a esta factura."
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
							}
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

		//Begin I@MM-21/12/2021-Ticket-2021-999
		metDialogValorReferencial: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			var varValorImporteTotalIGV = oModel.getProperty("/valGlobalImporteTotalIGV");

			var dialogMensaje = new sap.m.Dialog({
				draggable: true,
				resizable: true,
				contentWidth: "370px",
				title: "Mensaje de confirmación",
				content: [
					new sap.m.Label({
						text: "¿Desea actualizar el valor referencial?",
						wrapping: true,
						design: "Bold",
						width: "100%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Input("idValorReferencial2", {
						value: varValorImporteTotalIGV,
						placeholder: "Ingrese valor referencial",
						width: "100%",
						editable: true
					})
				],
				state: "Warning",
				type: "Message",
				beginButton: new sap.m.Button({
					press: function () {

						var varValor1 = parseFloat(varValorImporteTotalIGV.trim(), 10).toFixed(2);
						var varValor2 = parseFloat(sap.ui.getCore().byId("idValorReferencial2").getValue().trim(), 10).toFixed(2);
						console.log(varValor1);
						console.log(varValor2);

						if (varValor1 > varValor2) {
							var dialogA = new sap.m.Dialog({
								title: "Mensaje de advertencia",
								type: "Message",
								state: "Warning",
								content: new sap.m.Text({
									text: "El valor importe sin IGV es mayor que el valor referencial."
								}),
								beginButton: new sap.m.Button({
									text: "OK",
									type: "Accept",
									press: function () {
										this.getView().byId("idValorReferencial").setValue("     " + varValor2);
										
										dialogA.close();
									}.bind(this)
								}),
								afterClose: function (response) {
									dialogA.destroy();
								}.bind(this)

							});
							dialogA.open();
						} else {
							this.getView().byId("idValorReferencial").setValue("     " + varValor2);
						}

						dialogMensaje.close();
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
		},
		
		btnUdpLabelValorReferencial: function () {
			
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			var varValorImporteTotalIGV = this.getView().byId("idImporteTotalIGV").getValue().trim();
			var varValorReferencial = this.getView().byId("idValorReferencial").getValue().trim();

			var dialogMensaje = new sap.m.Dialog({
				draggable: true,
				resizable: true,
				contentWidth: "370px",
				title: "Mensaje de confirmación",
				content: [
					new sap.m.Label({
						text: "¿Desea actualizar el valor referencial?",
						wrapping: true,
						design: "Bold",
						width: "100%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.Input("idValorReferencial2", {
						value: varValorReferencial,
						placeholder: "Ingrese valor referencial",
						width: "100%",
						editable: true
					})
				],
				state: "Warning",
				type: "Message",
				beginButton: new sap.m.Button({
					press: function () {

						var varValor1 = parseFloat(varValorImporteTotalIGV, 10).toFixed(2);
						var varValor2 = parseFloat(sap.ui.getCore().byId("idValorReferencial2").getValue().trim(), 10).toFixed(2);
						console.log(varValor1);
						console.log(varValor2);

						if (varValor1 > varValor2) {
							var dialogA = new sap.m.Dialog({
								title: "Mensaje de advertencia",
								type: "Message",
								state: "Warning",
								content: new sap.m.Text({
									text: "El valor importe sin IGV es mayor que el valor referencial."
								}),
								beginButton: new sap.m.Button({
									text: "OK",
									type: "Accept",
									press: function () {
										this.getView().byId("idValorReferencial").setValue("     " + varValor2);
										
										dialogA.close();
									}.bind(this)
								}),
								afterClose: function (response) {
									dialogA.destroy();
								}.bind(this)

							});
							dialogA.open();
						} else {
							this.getView().byId("idValorReferencial").setValue("     " + varValor2);
						}

						dialogMensaje.close();
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
		},
		//End I@MM-21/12/2021-Ticket-2021-999

		limpiarPantalla: function () {
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			this.getView().byId("idTotalDescuentos").setValue("     ");
			this.getView().byId("idTotalIGV").setValue("     ");
			this.getView().byId("idImporteTotal").setValue("     ");

			this.getView().byId("idValidacionFacySunat1").setText("Estado del comprobante a la fecha de la consulta : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat1").setType("Information");
			this.getView().byId("idValidacionFacySunat2").setText("Estado del contribuyente a la fecha de emisión : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat2").setType("Information");
			this.getView().byId("idValidacionFacySunat3").setText("Condición de domicilio a la fecha de emisión : SIN ASIGNAR.");
			this.getView().byId("idValidacionFacySunat3").setType("Information");
			// Iniciar Cabecera de la factura XML
			oModel.setProperty("/listItemCabeceraFactura", []);
			oModel.setProperty("/listDocAdjuntarFac", []); //GM26102021
			oModel.setProperty("/listItemFacturas", []); //GM26102021
			oModel.setProperty("/listItemFacturasxeliminar", []); //gm03112021
			oModel.setProperty("/listItemFacturaPosicion", []); //GM26102021
			oModel.setProperty("/listItemFacturaPosicionxeliminar", []); //gm03112021
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
			llaveCabeceraFacLabel[10] = "Tipo de detracción";

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
			llaveCabeceraFacValue[10] = "-----";

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

			//this.getView().byId("idXML").setValue("");
			this.getView().byId("idFacturar").setEnabled(false);
			this.getView().byId("idAnadirDocSus").setEnabled(false);
			this.getView().byId("idAsignar").setEnabled(false);
			this.getView().byId("idValidacionFacAsig").setText("Sin items a asignar");
			this.getView().byId("idValidacionFacAsig").setType("Information");
			this.getView().byId("idValidacionDoc").setText("Sin Documentos Sustentos a asignar");
			this.getView().byId("idValidacionDoc").setType("Information");
			this.getView().byId("idValidacionDeta").setText("Sin detracción a validar."); // MAURO 20211014
			this.getView().byId("idValidacionDeta").setType("Information"); // MAURO 20211014
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

			var comboTipo = this.getView().byId("idComboTipo");
			comboTipo.getBinding("items").refresh(true);
			var firstItem = comboTipo.getItems()[0];
			comboTipo.setSelectedItem(firstItem, true);
			this.getView().byId("idComboTipo").setValueState("None");

			// MAURO 20211014
			/*var comboDetra = this.getView().byId("idCodigoDetra");
			comboDetra.getBinding("items").refresh(true);
			firstItem = comboDetra.getItems()[0];
			comboDetra.setSelectedItem(firstItem, true);
			this.getView().byId("idCodigoDetra").setValueState("None");*/

			var oCodFinalDetraccion = "N.A.";
			console.log(oCodFinalDetraccion);

			var oDesFinalDetraccion = "No válido";
			console.log(oDesFinalDetraccion);

			var oTblDetraccion = oModel.getProperty("/tblDetraccion");
			//this.getView().byId("idCodigoDetra2").setValue(oCodFinalDetraccion + " - " + oDesFinalDetraccion);
			for (var k = 0; k < oTblDetraccion.length; k++) {
				if (oModel.getProperty("/codigoDetr/" + k + "/codigo") === oCodFinalDetraccion) {
					var comboDetra = this.getView().byId("idCodigoDetra");
					comboDetra.getBinding("items").refresh(true);
					var firstItem = comboDetra.getItems()[k];
					comboDetra.setSelectedItem(firstItem, true);
				}
			}
			// MAURO 20211014
		},

		limpiarPantalla2: function () { // MAURO 20211014
			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);

			this.getView().byId("idTotalDescuentos").setValue("     ");
			this.getView().byId("idTotalIGV").setValue("     ");
			this.getView().byId("idImporteTotal").setValue("     ");

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
			llaveCabeceraFacLabel[10] = "Tipo de detracción";

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
			llaveCabeceraFacValue[10] = "-----";

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

			//this.getView().byId("idXML").setValue("");
			this.getView().byId("idFacturar").setEnabled(false);
			this.getView().byId("idAnadirDocSus").setEnabled(false);
			this.getView().byId("idAsignar").setEnabled(false);
			this.getView().byId("idValidacionFacAsig").setText("Sin items a asignar");
			this.getView().byId("idValidacionFacAsig").setType("Information");
			this.getView().byId("idValidacionDoc").setText("Sin Documentos Sustentos a asignar");
			this.getView().byId("idValidacionDoc").setType("Information");
			this.getView().byId("idValidacionDeta").setText("Sin detracción a validar."); // MAURO 20211014
			this.getView().byId("idValidacionDeta").setType("Information"); // MAURO 20211014
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

			// MAURO 20211014
			/*var comboDetra = this.getView().byId("idCodigoDetra");
			comboDetra.getBinding("items").refresh(true);
			var firstItem = comboDetra.getItems()[0];
			comboDetra.setSelectedItem(firstItem, true);
			this.getView().byId("idCodigoDetra").setValueState("None");*/

			var oCodFinalDetraccion = "N.A.";
			console.log(oCodFinalDetraccion);

			var oDesFinalDetraccion = "No válido";
			console.log(oDesFinalDetraccion);

			var oTblDetraccion = oModel.getProperty("/tblDetraccion");
			//this.getView().byId("idCodigoDetra2").setValue(oCodFinalDetraccion + " - " + oDesFinalDetraccion);
			for (var k = 0; k < oTblDetraccion.length; k++) {
				if (oModel.getProperty("/codigoDetr/" + k + "/codigo") === oCodFinalDetraccion) {
					var comboDetra = this.getView().byId("idCodigoDetra");
					comboDetra.getBinding("items").refresh(true);
					var firstItem = comboDetra.getItems()[k];
					comboDetra.setSelectedItem(firstItem, true);
				}
			}
			// MAURO 20211014
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
			console.log("Facturar");

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
			if (itemComboboxRetrac === "N.A.") { // MAURO 20211014
				textDecision = "NO";
			} else {
				textDecision = "SI";
			}

			var dialog = new sap.m.Dialog({
				title: 'Mensaje', // MAURO 20211014
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
				beginButton: new sap.m.Button("idOK", { //gm26102021
					text: 'OK',
					type: 'Emphasized',
					press: function () {
						dialog.close();
						console.log("Aceptar") //gm26102021
						sap.ui.getCore().byId("idOK").setEnabled(false); //gm26102021
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
			console.log("btnFacturar");
			this.contDetalle = 0;
			this.contPosicion = 0;
			this.contDocumentoData = 0;
			this.contDocumentoRepo = 0;

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
				var listDocsAdjuntarFac = oModel22.getProperty("/listDocAdjuntarFac");
				var listItemFacturasaux = oModel22.getProperty("/listItemFacturas");
				var listItemFacturaPosicionsaux = oModel22.getProperty("/listItemFacturaPosicion");
				var listTblPRODCOMP0 = (listItemFacturasaux.length > 0) ? JSON.parse(JSON.stringify(listItemFacturasaux)) : [];
				var listTblPRODCOMP0Posicion = (listItemFacturaPosicionsaux.length > 0) ? JSON.parse(JSON.stringify(listItemFacturaPosicionsaux)) : [];
				var listTblPRODCOMP0DOC = (listDocsAdjuntarFac.length > 0) ? JSON.parse(JSON.stringify(listDocsAdjuntarFac)) : [];

				this.detalleFacturaGlobal = listTblPRODCOMP0;
				this.detallePosFacturaGlobal = listTblPRODCOMP0Posicion;
				this.detalleAdjuntoGlobal = listTblPRODCOMP0DOC;

				oView22.setModel(oModel22);

				var varTabla = oModel22.getProperty("/listTablaDocumentos");

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
				var listItemDetalleFactura = model.getProperty("/listItemDetalleFactura");
				var mensaje = "";
				var halloError = "";
				for (var a = 0; a < listItemDetalleFactura.length; a++) {
					var itemsOC = listItemDetalleFactura[a].clistItemsOrdenCompra;
					for (var b = 0; b < itemsOC.length; b++) {
						if (itemsOC[b].DE_POS_DOC_MATERIAL === "" || itemsOC[b].DE_POS_DOC_MATERIAL === null || itemsOC[b].DE_POS_DOC_MATERIAL ===
							undefined) {
							halloError = "x";
							mensaje = "Posición incorrecta. Se procede con la anulación del registro.";
							break;
						}
						if (listItemDetalleFactura[a].clistItemDetalleFacturaCodigo === "" || listItemDetalleFactura[a].clistItemDetalleFacturaCodigo ===
							null || listItemDetalleFactura[a].clistItemDetalleFacturaCodigo ===
							undefined) {
							halloError = "x";
							mensaje = "Código incorrecto. Se procede con la anulación del registro.";
							break;
						}
						if (listItemDetalleFactura[a].clistItemDetalleFacturaDescripcion === "" || listItemDetalleFactura[a].clistItemDetalleFacturaDescripcion ===
							null || listItemDetalleFactura[a].clistItemDetalleFacturaDescripcion ===
							undefined) {
							halloError = "x";
							mensaje = "Descripción incorrecta. Se procede con la anulación del registro.";
							break;
						}
						if (itemsOC[b].DE_CANTIDAD === "" || itemsOC[b].DE_CANTIDAD === null || itemsOC[b].DE_CANTIDAD ===
							undefined) {
							halloError = "x";
							mensaje = "Cantidad incorrecta. Se procede con la anulación del registro.";
							break;
						}
						if (listItemDetalleFactura[a].clistItemDetalleFacturaPreUnixItem === "" || listItemDetalleFactura[a].clistItemDetalleFacturaPreUnixItem ===
							null || listItemDetalleFactura[a].clistItemDetalleFacturaPreUnixItem ===
							undefined) {
							halloError = "x";
							mensaje = "P.U sin IGV incorrecto. Se procede con la anulación del registro.";
							break;
						}
						if (listItemDetalleFactura[a].clistItemDetalleFacturaPreVenxItem === "" || listItemDetalleFactura[a].clistItemDetalleFacturaPreVenxItem ===
							null || listItemDetalleFactura[a].clistItemDetalleFacturaPreVenxItem ===
							undefined) {
							halloError = "x";
							mensaje = "P.U con IGV incorrecto. Se procede con la anulación del registro.";
							break;
						}
					}
					if (halloError === "x") {
						break;
					}
				}
				halloError = "";
				if (halloError === "") {
					var varContNumErrores = true;
					//oModel.read("/T_FACs?$format=json", {
					oModel.read("/" + this.varTableT_FAC + "?$format=json", {
						filters: filters,
						success: function (response) {
							var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
							var lenghtV = oModelJSON.getData().length;
							if (lenghtV === 0) {

								var cabecera = model.getProperty("/listItemCabeceraFactura");
								var usuario = model.getProperty("/usuarioLogin");
								var rucUser = model.getProperty("/usuarioRuc");

								var SOHeader = {};
								SOHeader.EM_RUC = this.varRucDeLaEmpresa;
								SOHeader.US_RUC = usuario;
								SOHeader.ID_FACTURA = paginaCard.description;

								SOHeader.UBL = cabecera[0].value.trim();
								SOHeader.FC_FEC_EMISION = cabecera[1].value.trim();
								SOHeader.DIRECCION = cabecera[11].value.trim().substring(0, 249);
								SOHeader.NOM_DEM_RAZ = cabecera[2].value.trim().substring(0, 49);
								SOHeader.NOM_COMERCIAL = cabecera[3].value.trim().substring(0, 49);
								//		SOHeader.RUC = cabecera[4].value.trim();
								SOHeader.TIPO_DOC = cabecera[5].value.trim();
								SOHeader.RUC_ADQ = cabecera[6].value.trim();
								SOHeader.NOM_DEM_RAZ_ADQ = cabecera[7].value.trim().substring(0, 49);
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

								SOHeader.FEC_PAGO = "";
								SOHeader.FEC_TEN = "";
								SOHeader.TEXTO_CAB_DOCUMENTO = "";
								oModel22.setProperty("/listConsultaResumenFactura", SOHeader);
								//oModel.create("/T_FACs", SOHeader, {
								oModel.create("/" + this.varTableT_FAC + "", SOHeader, {
									method: "POST",
									success: function (data) {
										this.varObjeto1 = {
											"EM_RUC": "",
											"US_RUC": "",
											"ID_FACTURA": ""
										};
										this.varObjeto1.EM_RUC = this.varRucDeLaEmpresa;
										this.varObjeto1.US_RUC = usuario;
										this.varObjeto1.ID_FACTURA = paginaCard.description;

										this.varTotalInsertEje++; // 20200608
										this.funValidarEstadoInsert(this.varRucDeLaEmpresa, usuarioLogin, paginaCard.description, date, time);
										this.obtenerExitoOdata("Factura " + data.ID_FACTURA, "Se registró con éxito la factura " + data.ID_FACTURA + ".");

										var llavePos = {};
										var llaveItem = {};
										for (var a = 0; a < listItemDetalleFactura.length; a++) {
											llavePos = {};
											llavePos.EM_RUC = this.varRucDeLaEmpresa;
											llavePos.US_RUC = usuario;
											llavePos.ID_FACTURA = paginaCard.description;
											llavePos.POS_FACTURA = listItemDetalleFactura[a].clistItemDetalleFacturaPosicion;
											llavePos.PRECIO_NETO = listItemDetalleFactura[a].clistItemDetalleFacturaValortotalNetoXItem;
											llavePos.CODIGO = listItemDetalleFactura[a].clistItemDetalleFacturaCodigo.substring(0, 29);
											llavePos.DESCRIPCION = listItemDetalleFactura[a].clistItemDetalleFacturaDescripcion.substring(0, 99);
											llavePos.UND_MED = listItemDetalleFactura[a].clistItemDetalleFacturaUniMedida;
											//llavePos.CANTIDAD = parseInt(listItemDetalleFactura[a].clistItemDetalleFacturaCantidad).toString();
											if (listItemDetalleFactura[a].clistItemDetalleFacturaCantidad === "NaN") {
												llavePos.CANTIDAD = "0.00";
											} else {
												llavePos.CANTIDAD = parseFloat(listItemDetalleFactura[a].clistItemDetalleFacturaCantidad).toFixed(2);
											}
											if (listItemDetalleFactura[a].clistItemDetalleFacturaPreUnixItem === "NaN") {
												llavePos.PRE_UNI = "0.00";
											} else {
												llavePos.PRE_UNI = parseFloat(listItemDetalleFactura[a].clistItemDetalleFacturaPreUnixItem).toFixed(2);
											}
											if (listItemDetalleFactura[a].clistItemDetalleFacturaPreVenxItem === "NaN") {
												llavePos.PRE_VENTA = "0.00";
											} else {
												llavePos.PRE_VENTA = parseFloat(listItemDetalleFactura[a].clistItemDetalleFacturaPreVenxItem).toFixed(2);
											}

											var itemsOC = listItemDetalleFactura[a].clistItemsOrdenCompra;
											for (var b = 0; b < itemsOC.length; b++) {
												llaveItem = {};
												llaveItem.EM_RUC = this.varRucDeLaEmpresa;
												llaveItem.US_RUC = usuario;
												llaveItem.ID_FACTURA = paginaCard.description;
												llaveItem.POS_FACTURA = listItemDetalleFactura[a].clistItemDetalleFacturaPosicion;
												//llaveItem.OC_NUMERO_ORDEN = itemsOC[b].DE_NUMERO_ORDEN;
												if (itemsOC[b].DE_NUMERO_ORDEN !== "" && itemsOC[b].DE_NUMERO_ORDEN !== null && itemsOC[b].DE_NUMERO_ORDEN !==
													undefined) {
													llaveItem.OC_NUMERO_ORDEN = itemsOC[b].DE_NUMERO_ORDEN;
												} else {
													llaveItem.OC_NUMERO_ORDEN = "";
												}
												//llaveItem.DE_POSICION = itemsOC[b].DE_POSICION;
												if (itemsOC[b].DE_POSICION !== "" && itemsOC[b].DE_POSICION !== null && itemsOC[b].DE_POSICION !== undefined) {
													llaveItem.DE_POSICION = itemsOC[b].DE_POSICION;
												} else {
													llaveItem.DE_POSICION = "";
												}
												llaveItem.PRECIO_ING = itemsOC[b].DE_TOTAL.toString().replace(',', '');
												llaveItem.CODIGO = "";
												llaveItem.DESCRIPCION = itemsOC[b].DE_DESCRIPCION.substring(0, 99);
												llaveItem.UND_MED = itemsOC[b].DE_MONEDA;
												//llaveItem.CANTIDAD = parseInt(itemsOC[b].DE_CANTIDAD.trim()).toString();
												//llaveItem.CANTIDAD = parseFloat(itemsOC[b].DE_CANTIDAD).toFixed(2);
												llaveItem.CANTIDAD = parseFloat(itemsOC[b].DE_CANTIDAD.trim().toString().replace(',', '')).toFixed(2);

												var tipo = itemsOC[b].DE_TIPO;
												if (tipo === "S") {
													llaveItem.VALE = itemsOC[b].DE_DOC_MATERIAL;
													llaveItem.VALE_NUM = itemsOC[b].DE_NUM_MATERIAL;
												} else {
													llaveItem.VALE = itemsOC[b].DE_HOJA_ENTRADA;
													llaveItem.VALE_NUM = itemsOC[b].DE_NUM_SERVICIO;
												}

												llaveItem.FEC_VALE = itemsOC[b].DE_FEC_REGISTRO;
												//llaveItem.GUIA_REMISION = itemsOC[b].DE_GUIA_REMISION;
												if (itemsOC[b].DE_GUIA_REMISION !== "" && itemsOC[b].DE_GUIA_REMISION !== null && itemsOC[b].DE_GUIA_REMISION !==
													undefined) {
													llaveItem.GUIA_REMISION = itemsOC[b].DE_GUIA_REMISION;
												} else {
													llaveItem.GUIA_REMISION = "";
												}
												llaveItem.PRE_UNI = "";
												llaveItem.PRE_VENTA = "";
												//llaveItem.DE_POS_DOC_MATERIAL = itemsOC[b].DE_POS_DOC_MATERIAL;
												if (itemsOC[b].DE_POS_DOC_MATERIAL !== "" && itemsOC[b].DE_POS_DOC_MATERIAL !== null && itemsOC[b].DE_POS_DOC_MATERIAL !==
													undefined) {
													llaveItem.DE_POS_DOC_MATERIAL = itemsOC[b].DE_POS_DOC_MATERIAL;
												}
												//llaveItem.DE_HOJA_ENTRADA = itemsOC[b].DE_HOJA_ENTRADA;
												if (itemsOC[b].DE_HOJA_ENTRADA !== "" && itemsOC[b].DE_HOJA_ENTRADA !== null && itemsOC[b].DE_HOJA_ENTRADA !==
													undefined) {
													llaveItem.DE_HOJA_ENTRADA = itemsOC[b].DE_HOJA_ENTRADA;
												} else {
													llaveItem.DE_HOJA_ENTRADA = "";
												}
												//llaveItem.DE_DOC_MATERIAL = itemsOC[b].DE_DOC_MATERIAL;
												if (itemsOC[b].DE_DOC_MATERIAL !== "" && itemsOC[b].DE_DOC_MATERIAL !== null && itemsOC[b].DE_DOC_MATERIAL !==
													undefined) {
													llaveItem.DE_DOC_MATERIAL = itemsOC[b].DE_DOC_MATERIAL;
												} else {
													llaveItem.DE_DOC_MATERIAL = "";
												}
												//oModel.create("/T_FAC_POSs", llaveItem, {
												console.log(llaveItem);
												oModel.create("/" + this.varTableT_FAC_POS + "", llaveItem, {
													method: "POST",
													success: function (data) {

														var listItemFacturaPosicion = oModel22.getProperty("/listItemFacturaPosicion");
														listItemFacturaPosicion.push(itemsOC[this.contPosicion]);
														oModel22.setProperty("/listItemFacturaPosicion", listItemFacturaPosicion);
														this.contPosicion++;

														var llave = {};
														llave = data;
														var vector = oModel22.getProperty("/listItemFacturaPosicionxeliminar");
														vector.push(llave);
														oModel22.setProperty("/listItemFacturaPosicionxeliminar", vector);
														this.varTotalInsertEje++; // 20200608
														this.funValidarEstadoInsert(this.varRucDeLaEmpresa, usuarioLogin, paginaCard.description, date, time);
														var llaveActualizar = {};
														llaveActualizar.DE_FLAC = "x";
														//var texto = "/T_OC_DETs(EM_RUC='" + data.EM_RUC + "',US_RUC='" + data.US_RUC + "',DE_POSICION='" +
														var texto = "/" + this.varTableT_OC_DET + "(EM_RUC='" + this.varRucDeLaEmpresa + "',US_RUC='" + data.US_RUC +
															"',DE_POSICION='" +
															data.DE_POSICION +
															//"',DE_GUIA_REMISION='" + data.GUIA_REMISION + 
															"',DE_DOC_MATERIAL='" + data.DE_DOC_MATERIAL +
															"',DE_NUMERO_ORDEN='" + data.OC_NUMERO_ORDEN + "',DE_HOJA_ENTRADA='" + data.DE_HOJA_ENTRADA +
															"',DE_POS_DOC_MATERIAL='" + data.DE_POS_DOC_MATERIAL + "')";
														oModel.update(texto, llaveActualizar, {
															method: "PUT",
															success: function (data) {},
															error: function (data) {
																console.log(data);
															}
														});
														this.obtenerExitoOdata("Factura " + data.ID_FACTURA + ", posición " + data.DE_POSICION + ", OC " + data.OC_NUMERO_ORDEN,
															"Se registró con éxito la posición OC" + data.DE_POSICION + " - " + data.OC_NUMERO_ORDEN + " .");
													}.bind(this),
													error: function (data) {
														this.contPosicion++;
														console.log(data);
														varContNumErrores = false;
														this.varTotalInsertEjeError++;
														this.obtenerErrorOdata(data, "Error al registrar en T_FAC_POS",
															"No se pudo registrar una posición OC de la factura " + paginaCard.description + ".");
													}.bind(this)
												});
											}
											//oModel.create("/T_FAC_DETs", llavePos, {
											console.log(llavePos);

											oModel.create("/" + this.varTableT_FAC_DET + "", llavePos, {
												method: "POST",
												success: function (data) {
													debugger;
													var listItemFacturas = oModel22.getProperty("/listItemFacturas");
													listItemFacturas.push(listItemDetalleFactura[this.contDetalle]);
													oModel22.setProperty("/listItemFacturas", listItemFacturas);

													var llave = {};
													var vector = oModel22.getProperty("/listItemFacturasxeliminar");
													llave = data;
													vector.push(llave);
													oModel22.setProperty("/listItemFacturasxeliminar", vector);

													this.contDetalle++;
													this.varTotalInsertEje++; // 20200608
													this.funValidarEstadoInsert(this.varRucDeLaEmpresa, usuarioLogin, paginaCard.description, date, time);
													this.obtenerExitoOdata("Factura " + data.ID_FACTURA + ", item " + data.POS_FACTURA,
														"Se registró con éxito el item de la factura " + data.POS_FACTURA + " - " + data.ID_FACTURA + " .");
												}.bind(this),
												error: function (data) {
													console.log(data);
													this.contDetalle++;
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
											llaveDocumento.NOMBRE_DOC = varTabla[i].clistTabDocuNombreArch.substring(0, 99);
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
											console.log(llaveDocumento);
											this.funSubriDocumento(varDocItemArchivo, varDocItemNombre, llaveDocumento, date, time);
										} ///////////////////////////////////////////////////////////////////
										//this.getView().setBusy(false);
									}.bind(this),
									error: function (data) {
										console.log(data);
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
										}.bind(this)
									}),
									afterClose: function () {
										dialog.destroy();
									}
								});
								dialog.open();
							}
						}.bind(this),
						error: function (oError) {
							console.log(oError);
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
					var dialog = new sap.m.Dialog({
						title: "Mensaje de Error",
						type: "Message",
						state: "Error",
						height: "auto",
						icon: "sap-icon://accept",
						content: [
							new sap.ui.layout.VerticalLayout({
								width: "100%",
								content: [
									new sap.m.Label({
										text: "El registro de factura tiene errores: ",
										design: "Bold"
									}), new sap.m.Label({
										text: " " + mensaje
									})
								]
							})
						],
						beginButton: new sap.m.Button({
							text: "Aceptar",
							press: function () {
								this.getView().setBusy(false);
								dialog.close();
							}.bind(this)
						}),
						afterClose: function () {
							dialog.destroy();
						}
					});
					dialog.open();
				}
			} else {
				sap.m.MessageToast.show("Se requiere seleccionar el tipo de carga .");
			}

		},

		funSubriDocumento: function (archivo, nombre, llave, date, time) {
			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");
			var listDocAdjuntarFac = oModel.getProperty("/listDocAdjuntarFac");
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
							this.contDocumentoData++;
							listDocAdjuntarFac.push(llave);
							oModel.setProperty("/listDocAdjuntarFac", listDocAdjuntarFac);
							this.varTotalInsertEje++; // 20200608
							this.funValidarEstadoInsert(llave.EM_RUC, llave.US_RUC, llave.ID_FACTURA, date, time);
						}.bind(this),
						error: function (data) {
							console.log(data);
							this.contDocumentoData++;
							this.varTotalInsertEjeError++;
							this.funValidarEstadoInsert(llave.EM_RUC, llave.US_RUC, llave.ID_FACTURA, date, time);
						}.bind(this)
					});
					//this.obtenerExitoOdata("Factura " + fileName, "Se guardó con éxito el archivo " + fileName + ".");
				}.bind(this),
				error: function (data) {
					console.log(data);
					this.contDocumentoData++;
					this.varTotalInsertEjeError++;
					this.funValidarEstadoInsert(llave.EM_RUC, llave.US_RUC, llave.ID_FACTURA, date, time);
					//this.obtenerErrorOdata(data, "Error al registrar en el Document Service", "No se pudo guardar el archivo" + fileName + ".");
				}.bind(this)
			});
		},

		funValidarEstadoInsert: function (EM_RUC, US_RUC, ID_FACTURA, date, time) {
			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");
			var varTabla = oModel.getProperty("/listTablaDocumentos");
			var varTablaAUX = oModel.getProperty("/listItemFacturas");
			var varTablaAUX1 = oModel.getProperty("/listItemDetalleFactura");
			var varTablaAUX2 = oModel.getProperty("/listItemFacturaPosicion");
			var varTablaAUX0 = this.detalleFacturaGlobal;

			debugger;
			if (this.varTotalInsert === this.varTotalInsertEje) {
				debugger;
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
					error: function (data) {}
				});
			}

			if (this.varTotalInsertEjeError > 0 && this.varTotalInsertEjeErrorVal === false && varTabla.length === this.contDocumentoData) {

				this.varTotalInsertEjeErrorVal = true;

				var listDocAdjuntarFac = oModel.getProperty("/listDocAdjuntarFac");
				var listItemFacturas = oModel.getProperty("/listItemFacturas");
				var listItemdetalleFacturas = oModel.getProperty("/listItemDetalleFactura");
				var listItemFacturaPosicion = oModel.getProperty("/listItemFacturaPosicion");
				console.log(listDocAdjuntarFac);
				console.log(listItemFacturas);
				console.log(listItemFacturaPosicion);
				console.log(listItemdetalleFacturas);

				// this.varObjeto1.EM_RUC = this.varRucDeLaEmpresa;
				// 						this.varObjeto1.US_RUC = usuario;
				// 						this.varObjeto1.ID_FACTURA = paginaCard.description;
				console.log(this.varObjeto1);

				var dialog = new sap.m.Dialog({
					title: "Mensaje de Error",
					type: "Message",
					state: "Error",
					icon: "sap-icon://accept",
					content: new sap.m.Text({
						text: "La factura no fue cargada correctamente, por favor eliminar y volver a intentar."
					}),
					beginButton: new sap.m.Button({
						text: "Eliminar factura",
						press: function () {
							this.getView().setBusy(false);
							// this.getRouter().navTo("Vista_Menu_Principal");
							dialog.close();
							this.ressEliminarFactura2();
						}.bind(this)
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();
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
					var oJSON = vectorReg;
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
		_DeleteDatarepo: function (Nombre, data) {
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
					var oJSON = "V";
					console.log(oJSON);

					oConsultaHistorica = "V";
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
					var oJSON = "V";
					console.log(oJSON);

					oConsultaHistorica = "V";
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

			this.varContTabla1 = 0;
			this.varContTabla2 = 0;
			this.varContTabla3 = 0;
			this.varContTabla4 = 0;
			this.varContTabla5 = 0;
			this.varEstado1 = "V";
			this.varEstado2 = "V";
			this.varEstado3 = "V";
			this.varEstado4 = "V";

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);
			var oView22 = this.getView();
			var oModel22 = oView22.getModel("myParam");
			var listDocsAdjuntarFac = oModel22.getProperty("/listDocAdjuntarFac");
			//var listItemFacturasaux = oModel22.getProperty("/listItemFacturas");	D@GM-03/11/2021-
			var listItemFacturasaux = oModel22.getProperty("/listItemFacturasxeliminar");
			//var listItemFacturaPosicionsaux = oModel22.getProperty("/listItemFacturaPosicion");	D@GM-03/11/2021-	
			var listItemFacturaPosicionsaux = oModel22.getProperty("/listItemFacturaPosicionxeliminar");
			var listTblPRODCOMP0 = (listItemFacturasaux.length > 0) ? JSON.parse(JSON.stringify(listItemFacturasaux)) : [];
			var listTblPRODCOMP0Posicion = (listItemFacturaPosicionsaux.length > 0) ? JSON.parse(JSON.stringify(listItemFacturaPosicionsaux)) : [];
			var listTblPRODCOMP0DOC = (listDocsAdjuntarFac.length > 0) ? JSON.parse(JSON.stringify(listDocsAdjuntarFac)) : [];
			this.detalleFacturaGlobal = listTblPRODCOMP0;
			this.detallePosFacturaGlobal = listTblPRODCOMP0Posicion;
			this.detalleAdjuntoGlobal = listTblPRODCOMP0DOC;

			var listDocAdjuntarFac = this.detalleAdjuntoGlobal; //oModel.getProperty("/listDocAdjuntarFac");
			//	var listItemFacturas = this.detalleFacturaGlobal;//oModel.getProperty("/listItemDetalleFactura/0/clistItemsOrdenCompra");//listItemDetalleFactura//listItemFacturas

			//var listItemFacturas =oModel.getProperty("/listItemFacturas/0/clistItemsOrdenCompra");
			//if(listItemFacturasaux==undefined){
			var listItemFacturas = this.detalleFacturaGlobal;
			//}else{
			//	var listItemFacturasaux =oModel.getProperty("/listItemFacturas/0/clistItemsOrdenCompra");
			//}

			var listItemFacturaPosicion = this.detallePosFacturaGlobal; //oModel.getProperty("/listItemFacturaPosicion");

			// var objeto = this.getView().byId("ohFac").getBindingContext("myParam").getObject();

			this.varObjeto1 = this.varObjeto1;

			var data1 = {
				'cmisaction': 'delete'
			};
			var formData = new FormData();
			jQuery.each(data1, function (key, value) {
				formData.append(key, value);
			});

			if (listDocAdjuntarFac.length !== 0) {
				for (var d1 = 0; d1 < listDocAdjuntarFac.length; d1++) {
					console.log("" + this.varTableDocument + "/" + listDocAdjuntarFac[d1].NOMBRE_DOC);
					var oConsultaDocResponse = this._getDatadocsust(this.varTableDocumentConsultar, listDocAdjuntarFac[d1].NOMBRE_DOC);
					var oConsultaDoc = oConsultaDocResponse.response;
					console.log(oConsultaDoc);
					if (oConsultaDoc.length > 1 && oConsultaDoc != false) {
						console.log("REPOSITORIO ELIMINAR");
						var oDeleteDocRepo = this._DeleteDatarepo(listDocAdjuntarFac[d1].NOMBRE_DOC, formData);
						console.log(oDeleteDocRepo);
						if (oDeleteDocRepo == "V") {
							console.log("T_DOC ELIMINAR");

							var documento = "/" + this.varTableT_DOC + "(EM_RUC='" + listDocAdjuntarFac[d1].EM_RUC +
								"',US_RUC='" + listDocAdjuntarFac[d1].US_RUC +
								"',ID_FACTURA='" + listDocAdjuntarFac[d1].ID_FACTURA +
								"',POS_DOCUMENTO='" + listDocAdjuntarFac[d1].POS_DOCUMENTO + "')";
							console.log(documento);
							oModelOData.remove(documento, {
								success: function (response) {
									this.varContTabla2++;
									if (this.varContTabla2 === listDocAdjuntarFac.length) {
										console.log("T_FAC_DET ELIMINAR");
										console.log(listItemFacturas);
										debugger;
										if (listItemFacturas.length === 0) {

											console.log("T_FAC_POS ELIMINAR");
											if (listItemFacturaPosicion.length === 0) {
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
																	this.getRouter().navTo("Vista_Menu_Principal");
																}.bind(this)
															}),
															afterClose: function () {
																dialogA.destroy();
															}
														});
														dialogA.open();

														this.getView().setBusy(false);
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
																	this.getRouter().navTo("Vista_Menu_Principal");
																}.bind(this)
															}),
															afterClose: function () {
																dialogA.destroy();
															}
														});
														dialogA.open();
														this.getView().setBusy(false);
													}.bind(this),
												});

											} else {
												console.log("T_OC_DET ELIMINAR");
												for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
													if (listItemFacturaPosicion[d4].US_RUC != undefined) { //GM26102021V2 incio
														var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
														if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
															//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
															var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
																//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
															var llaveActualizar = {};
															llaveActualizar.DE_FLAC = '';
															console.log(actOrdenCompra);
															oModelOData.update(actOrdenCompra, llaveActualizar, {
																method: "PUT",
																success: function (response) {
																	this.varContTabla4++;
																	if (this.varContTabla4 === listItemFacturaPosicion.length) {
																		console.log("T_FAC_POS ELIMINA2R");
																		for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																			var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																				"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																				"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																				"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																				"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																				"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																				"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																				"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																				//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																				"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																											this.getRouter().navTo("Vista_Menu_Principal");
																										}.bind(this)
																									}),
																									afterClose: function () {
																										dialogA.destroy();
																									}
																								});
																								dialogA.open();

																								this.getView().setBusy(false);
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
																											this.getRouter().navTo("Vista_Menu_Principal");
																										}.bind(this)
																									}),
																									afterClose: function () {
																										dialogA.destroy();
																									}
																								});
																								dialogA.open();

																								this.getView().setBusy(false);
																							}.bind(this),
																						});
																					}
																				}.bind(this),
																				error: function (data) {
																					this.getView().setBusy(false);
																					console.log(data);
																				}.bind(this)
																			});

																		}
																	}
																}.bind(this),
																error: function (response) {
																	console.log(response);
																	this.getView().setBusy(false);
																	if (this.varEstado4 === "V") {
																		this.varEstado4 = "E";
																		this.funValidarConteoDeRegistros();
																	}
																}.bind(this)
															});
														}
													} //GM26102021V2 fin
													//GM26102021 inicio
													else {
														console.log(listItemFacturaPosicion[d4]);
														var dialogA = new sap.m.Dialog({
															title: 'Error',
															type: 'Message',
															state: 'Error',
															icon: "sap-icon://error",
															content: new sap.m.Text({
																text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
															}),
															beginButton: new sap.m.Button({
																text: 'Aceptar',
																icon: "sap-icon://accept",
																type: "Accept",
																press: function () {
																	dialogA.close();
																	this.getRouter().navTo("Vista_Menu_Principal");
																}.bind(this)
															}),
															afterClose: function () {
																dialogA.destroy();
															}
														});
														dialogA.open();
														this.getView().setBusy(false);
													}
													//GM26102021 fin
												}
											}

										} else {
											for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
												//var detOrdenCompra = "/T_FAC_DETs(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
												if (listItemFacturas[d3].ID_FACTURA != undefined) {
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
																console.log("T_FAC_POS ELIMINAR");
																for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
																	if (listItemFacturaPosicion[d4].US_RUC != undefined) { //GM26102021V2 incio
																		var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																		if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																			//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																			var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																				"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																				"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
																				//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																				"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																				"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																				"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																				"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
																			var llaveActualizar = {};
																			llaveActualizar.DE_FLAC = '';
																			console.log(actOrdenCompra);
																			oModelOData.update(actOrdenCompra, llaveActualizar, {
																				method: "PUT",
																				success: function (response) {
																					this.varContTabla4++;
																					if (this.varContTabla4 === listItemFacturaPosicion.length) {
																						console.log("T_FAC_POS ELIMINA2R");
																						for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																							var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																								"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																								"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																								"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																								"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																								"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																								"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																								"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																								//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																								"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																															this.getRouter().navTo("Vista_Menu_Principal");
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();

																												this.getView().setBusy(false);
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
																															this.getRouter().navTo("Vista_Menu_Principal");
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();

																												this.getView().setBusy(false);
																											}.bind(this),
																										});
																									}
																								}.bind(this),
																								error: function (data) {
																									this.getView().setBusy(false);
																									console.log(data);
																								}.bind(this)
																							});

																						}
																					}
																				}.bind(this),
																				error: function (response) {
																					console.log(response);
																					this.getView().setBusy(false);
																					if (this.varEstado4 === "V") {
																						this.varEstado4 = "E";
																						this.funValidarConteoDeRegistros();
																					}
																				}.bind(this)
																			});
																		}
																	} //GM26102021V2 fin
																	else {

																		var dialogA = new sap.m.Dialog({
																			title: 'Error',
																			type: 'Message',
																			state: 'Error',
																			icon: "sap-icon://error",
																			content: new sap.m.Text({
																				text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
																			}),
																			beginButton: new sap.m.Button({
																				text: 'Aceptar',
																				icon: "sap-icon://accept",
																				type: "Accept",
																				press: function () {
																					dialogA.close();
																					this.getRouter().navTo("Vista_Menu_Principal");
																				}.bind(this)
																			}),
																			afterClose: function () {
																				dialogA.destroy();
																			}
																		});
																		dialogA.open();
																		this.getView().setBusy(false);
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

															}
														}.bind(this)
													});
												} else {
													console.log(listItemFacturas[d3]);
													var dialogA = new sap.m.Dialog({
														title: 'Error',
														type: 'Message',
														state: 'Error',
														icon: "sap-icon://error",
														content: new sap.m.Text({
															text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
														}),
														beginButton: new sap.m.Button({
															text: 'Aceptar',
															icon: "sap-icon://accept",
															type: "Accept",
															press: function () {
																dialogA.close();
																this.getRouter().navTo("Vista_Menu_Principal");
															}.bind(this)
														}),
														afterClose: function () {
															dialogA.destroy();
														}
													});
													dialogA.open();
													this.getView().setBusy(false);
												}
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

									}
								}.bind(this)
							});
						} else {
							this.varEstado2 = "E";
							this.funValidarConteoDeRegistros();
							this.getView().setBusy(false);

						}
					} else {
						console.log("T_DOC ELIMINAR");
						var documento = "/" + this.varTableT_DOC + "(EM_RUC='" + listDocAdjuntarFac[d1].EM_RUC +
							"',US_RUC='" + listDocAdjuntarFac[d1].US_RUC +
							"',ID_FACTURA='" + listDocAdjuntarFac[d1].ID_FACTURA +
							"',POS_DOCUMENTO='" + listDocAdjuntarFac[d1].POS_DOCUMENTO + "')";
						console.log(documento);
						oModelOData.remove(documento, {
							success: function (response) {
								this.varContTabla2++;
								if (this.varContTabla2 === listDocAdjuntarFac.length) {
									console.log("T_FAC_DET ELIMINAR");
									console.log(listItemFacturas);
									if (listItemFacturas.length === 0) {

										console.log("T_FAC_POS ELIMINAR");
										if (listItemFacturaPosicion.length === 0) {
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
																this.getRouter().navTo("Vista_Menu_Principal");
															}.bind(this)
														}),
														afterClose: function () {
															dialogA.destroy();
														}
													});
													dialogA.open();

													this.getView().setBusy(false);
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
																this.getRouter().navTo("Vista_Menu_Principal");
															}.bind(this)
														}),
														afterClose: function () {
															dialogA.destroy();
														}
													});
													dialogA.open();

													this.getView().setBusy(false);
												}.bind(this),
											});

										} else {
											for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
												if (listItemFacturaPosicion[d4].US_RUC != undefined) { //GM26102021V2 incio
													var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
													if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
														//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
														var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
															"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
															"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
															//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
															"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
															"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
															"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
															"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
														var llaveActualizar = {};
														llaveActualizar.DE_FLAC = '';
														console.log(actOrdenCompra);
														oModelOData.update(actOrdenCompra, llaveActualizar, {
															method: "PUT",
															success: function (response) {
																this.varContTabla4++;
																if (this.varContTabla4 === listItemFacturaPosicion.length) {
																	console.log("T_FAC_POS ELIMINA2R");
																	for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																		var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																			"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																			"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																			"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																			"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																			"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																			"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																			"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																			//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																			"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																										this.getRouter().navTo("Vista_Menu_Principal");
																									}.bind(this)
																								}),
																								afterClose: function () {
																									dialogA.destroy();
																								}
																							});
																							dialogA.open();

																							this.getView().setBusy(false);
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
																										this.getRouter().navTo("Vista_Menu_Principal");
																									}.bind(this)
																								}),
																								afterClose: function () {
																									dialogA.destroy();
																								}
																							});
																							dialogA.open();

																							this.getView().setBusy(false);
																						}.bind(this),
																					});
																				}
																			}.bind(this),
																			error: function (data) {
																				this.getView().setBusy(false);
																				console.log(data);
																			}.bind(this)
																		});

																	}
																}
															}.bind(this),
															error: function (response) {
																console.log(response);
																this.getView().setBusy(false);
																if (this.varEstado4 === "V") {
																	this.varEstado4 = "E";
																	this.funValidarConteoDeRegistros();
																}
															}.bind(this)
														});
													}
												} //GM26102021V2 fin
												//GM26102021 inicio
												else {
													console.log(listItemFacturaPosicion[d4]);
													var dialogA = new sap.m.Dialog({
														title: 'Error',
														type: 'Message',
														state: 'Error',
														icon: "sap-icon://error",
														content: new sap.m.Text({
															text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
														}),
														beginButton: new sap.m.Button({
															text: 'Aceptar',
															icon: "sap-icon://accept",
															type: "Accept",
															press: function () {
																dialogA.close();
																this.getRouter().navTo("Vista_Menu_Principal");
															}.bind(this)
														}),
														afterClose: function () {
															dialogA.destroy();
														}
													});
													dialogA.open();
													this.getView().setBusy(false);
												}
												//GM26102021 fin

											}
										}
									}

								} else {
									for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
										//var detOrdenCompra = "/T_FAC_DETs(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
										if (listItemFacturas[d3].ID_FACTURA != undefined) {
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
														console.log("T_FAC_POS ELIMINAR");
														for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
															if (listItemFacturaPosicion[d4].US_RUC != undefined) { //GM26102021V2 incio
																var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																	//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																	var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																		"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																		"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
																		//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																		"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																		"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																		"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																		"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
																	var llaveActualizar = {};
																	llaveActualizar.DE_FLAC = '';
																	console.log(actOrdenCompra);
																	oModelOData.update(actOrdenCompra, llaveActualizar, {
																		method: "PUT",
																		success: function (response) {
																			this.varContTabla4++;
																			if (this.varContTabla4 === listItemFacturaPosicion.length) {
																				console.log("T_FAC_POS ELIMINA2R");
																				for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																					var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																						"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																						"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																						"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																						"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																						"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																						"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																						"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																						//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																						"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																													this.getRouter().navTo("Vista_Menu_Principal");
																												}.bind(this)
																											}),
																											afterClose: function () {
																												dialogA.destroy();
																											}
																										});
																										dialogA.open();

																										this.getView().setBusy(false);
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
																													this.getRouter().navTo("Vista_Menu_Principal");
																												}.bind(this)
																											}),
																											afterClose: function () {
																												dialogA.destroy();
																											}
																										});
																										dialogA.open();

																										this.getView().setBusy(false);
																									}.bind(this),
																								});
																							}
																						}.bind(this),
																						error: function (data) {
																							this.getView().setBusy(false);
																							console.log(data);
																						}.bind(this)
																					});

																				}
																			}
																		}.bind(this),
																		error: function (response) {
																			console.log(response);
																			this.getView().setBusy(false);
																			if (this.varEstado4 === "V") {
																				this.varEstado4 = "E";
																				this.funValidarConteoDeRegistros();
																			}
																		}.bind(this)
																	});
																}
															} //GM26102021V2 fin
															else {
																console.log(listItemFacturaPosicion[d4]);
																var dialogA = new sap.m.Dialog({
																	title: 'Error',
																	type: 'Message',
																	state: 'Error',
																	icon: "sap-icon://error",
																	content: new sap.m.Text({
																		text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
																	}),
																	beginButton: new sap.m.Button({
																		text: 'Aceptar',
																		icon: "sap-icon://accept",
																		type: "Accept",
																		press: function () {
																			dialogA.close();
																			this.getRouter().navTo("Vista_Menu_Principal");
																		}.bind(this)
																	}),
																	afterClose: function () {
																		dialogA.destroy();
																	}
																});
																dialogA.open();
																this.getView().setBusy(false);
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

													}
												}.bind(this)
											});
										} else {
											console.log(listItemFacturas[d3]);
											var dialogA = new sap.m.Dialog({
												title: 'Error',
												type: 'Message',
												state: 'Error',
												icon: "sap-icon://error",
												content: new sap.m.Text({
													text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
												}),
												beginButton: new sap.m.Button({
													text: 'Aceptar',
													icon: "sap-icon://accept",
													type: "Accept",
													press: function () {
														dialogA.close();
														this.getRouter().navTo("Vista_Menu_Principal");
													}.bind(this)
												}),
												afterClose: function () {
													dialogA.destroy();
												}
											});
											dialogA.open();
											this.getView().setBusy(false);
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

								}
							}.bind(this)
						});
					}
				}
			} else {
				console.log("OTRO");
				if (listItemFacturas.length !== 0) {
					for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
						if (listItemFacturas[d3].ID_FACTURA != undefined) {
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
											if (listItemFacturaPosicion[d4].ID_FACTURA != undefined) {
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
																									this.getView().setBusy(false);
																									this.getRouter().navTo("Vista_Menu_Principal");
																									dialogA.close();
																									dialogA.destroy();
																								}.bind(this)
																							}),
																							afterClose: function () {
																								dialogA.destroy();
																							}
																						});
																						dialogA.open();

																						this.getView().setBusy(false);
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
																									this.getView().setBusy(false);
																									this.getRouter().navTo("Vista_Menu_Principal");
																									dialogA.close();
																									dialogA.destroy();
																								}.bind(this)
																							}),
																							afterClose: function () {
																								dialogA.destroy();
																							}
																						});
																						dialogA.open();

																					}.bind(this),
																				});
																			}
																		}.bind(this),
																		error: function (data) {}
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

														}
													}.bind(this)
												});
											} else { //GM03112021//V3

												var dialogA = new sap.m.Dialog({
													title: 'Error',
													type: 'Message',
													state: 'Error',
													icon: "sap-icon://error",
													content: new sap.m.Text({
														text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
													}),
													beginButton: new sap.m.Button({
														text: 'Aceptar',
														icon: "sap-icon://accept",
														type: "Accept",
														press: function () {
															dialogA.close();
															this.getRouter().navTo("Vista_Menu_Principal");
														}.bind(this)
													}),
													afterClose: function () {
														dialogA.destroy();
													}
												});
												dialogA.open();
												this.getView().setBusy(false);
											}
										}
									}
								}.bind(this),
								error: function (response) {
									if (this.varEstado3 === "V") {
										this.varEstado3 = "E";
										this.funValidarConteoDeRegistros();
										this.getView().setBusy(false);

									}
								}.bind(this)
							});
						} else {
							console.log(listItemFacturas[d3]);
							var dialogA = new sap.m.Dialog({
								title: 'Error',
								type: 'Message',
								state: 'Error',
								icon: "sap-icon://error",
								content: new sap.m.Text({
									text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
								}),
								beginButton: new sap.m.Button({
									text: 'Aceptar',
									icon: "sap-icon://accept",
									type: "Accept",
									press: function () {
										dialogA.close();
										this.getRouter().navTo("Vista_Menu_Principal");
									}.bind(this)
								}),
								afterClose: function () {
									dialogA.destroy();
								}
							});
							dialogA.open();
							this.getView().setBusy(false);

						}

					}
				} else {
					if (listItemFacturaPosicion.length !== 0) {
						for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
							if (listItemFacturaPosicion[d4].ID_FACTURA != undefined) {
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
																					this.getRouter().navTo("Vista_Menu_Principal");
																				}.bind(this)
																			}),
																			afterClose: function () {
																				dialogA.destroy();
																			}
																		});
																		dialogA.open();

																		this.getView().setBusy(false);

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
																					this.getRouter().navTo("Vista_Menu_Principal");
																				}.bind(this)
																			}),
																			afterClose: function () {
																				dialogA.destroy();
																			}
																		});
																		dialogA.open();

																		this.getView().setBusy(false);

																	}.bind(this),
																});
															}
														}.bind(this),
														error: function (data) {}
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

										}
									}.bind(this)
								});
							}
							//GM26102021 inicio
							else {
								console.log(listItemFacturas[d4]);
								var dialogA = new sap.m.Dialog({
									title: 'Error',
									type: 'Message',
									state: 'Error',
									icon: "sap-icon://error",
									content: new sap.m.Text({
										text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
									}),
									beginButton: new sap.m.Button({
										text: 'Aceptar',
										icon: "sap-icon://accept",
										type: "Accept",
										press: function () {
											dialogA.close();
											this.getRouter().navTo("Vista_Menu_Principal");
										}.bind(this)
									}),
									afterClose: function () {
										dialogA.destroy();
									}
								});
								dialogA.open();
								this.getView().setBusy(false);
							}
							//GM26102021 inicio
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
											this.getRouter().navTo("Vista_Menu_Principal");
										}.bind(this)
									}),
									afterClose: function () {
										dialogA.destroy();
									}
								});
								dialogA.open();

								this.getView().setBusy(false);

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
											this.getRouter().navTo("Vista_Menu_Principal");
										}.bind(this)
									}),
									afterClose: function () {
										dialogA.destroy();
									}
								});
								dialogA.open();

								this.getView().setBusy(false);

							}.bind(this),
						});
					}
				}
			}

		},
		//GM
		ressEliminarFactura3: function () {

			this.getView().setBusy(true);

			var oThis = this;
			var oView = oThis.getView();
			var oModel = oView.getModel("myParam");

			this.varContTabla1 = 0;
			this.varContTabla2 = 0;
			this.varContTabla3 = 0;
			this.varContTabla4 = 0;
			this.varContTabla5 = 0;
			this.varEstado1 = "V";
			this.varEstado2 = "V";
			this.varEstado3 = "V";
			this.varEstado4 = "V";

			//var url = "/odatabnv/odata2.svc/";
			var url = "" + this.varTableURL + "/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);

			var listDocAdjuntarFac = this.detalleAdjuntoGlobal; //oModel.getProperty("/listDocAdjuntarFac");
			//	var listItemFacturas = this.detalleFacturaGlobal;//oModel.getProperty("/listItemDetalleFactura/0/clistItemsOrdenCompra");//listItemDetalleFactura//listItemFacturas
			var listItemFacturas = oModel.getProperty("/listItemFacturas/0/clistItemsOrdenCompra");
			if (listItemFacturasaux == undefined) {
				var listItemFacturas = this.detalleFacturaGlobal;
			} else {
				var listItemFacturasaux = oModel.getProperty("/listItemFacturas/0/clistItemsOrdenCompra");
			}

			var listItemFacturaPosicion = this.detallePosFacturaGlobal; //oModel.getProperty("/listItemFacturaPosicion");

			// var objeto = this.getView().byId("ohFac").getBindingContext("myParam").getObject();

			this.varObjeto1 = this.varObjeto1;

			var data1 = {
				'cmisaction': 'delete'
			};
			var formData = new FormData();
			jQuery.each(data1, function (key, value) {
				formData.append(key, value);
			});

			if (listDocAdjuntarFac.length !== 0) {
				for (var d1 = 0; d1 < listDocAdjuntarFac.length; d1++) {
					console.log("" + this.varTableDocument + "/" + listDocAdjuntarFac[d1].NOMBRE_DOC);
					var oConsultaDocResponse = this._getDatadocsust(this.varTableDocumentConsultar, listDocAdjuntarFac[d1].NOMBRE_DOC);
					var oConsultaDoc = oConsultaDocResponse.response;
					console.log(oConsultaDoc);
					if (oConsultaDoc.length > 1 && oConsultaDoc != false) {
						console.log("REPOSITORIO ELIMINAR");
						var oDeleteDocRepo = this._DeleteDatarepo(listDocAdjuntarFac[d1].NOMBRE_DOC, formData);
						console.log(oDeleteDocRepo);
						if (oDeleteDocRepo == "V") {
							console.log("T_DOC ELIMINAR");

							var documento = "/" + this.varTableT_DOC + "(EM_RUC='" + listDocAdjuntarFac[d1].EM_RUC +
								"',US_RUC='" + listDocAdjuntarFac[d1].US_RUC +
								"',ID_FACTURA='" + listDocAdjuntarFac[d1].ID_FACTURA +
								"',POS_DOCUMENTO='" + listDocAdjuntarFac[d1].POS_DOCUMENTO + "')";
							console.log(documento);
							oModelOData.remove(documento, {
								success: function (response) {
									this.varContTabla2++;
									if (this.varContTabla2 === listDocAdjuntarFac.length) {
										console.log("T_FAC_DET ELIMINAR");
										console.log(listItemFacturas);
										if (listItemFacturas.length === 0) {

											console.log("T_FAC_POS ELIMINAR");
											if (listItemFacturaPosicion.length === 0) {
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
																	this.getRouter().navTo("Vista_Menu_Principal");
																}.bind(this)
															}),
															afterClose: function () {
																dialogA.destroy();
															}
														});
														dialogA.open();

														this.getView().setBusy(false);
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
																	this.getRouter().navTo("Vista_Menu_Principal");
																}.bind(this)
															}),
															afterClose: function () {
																dialogA.destroy();
															}
														});
														dialogA.open();

														this.getView().setBusy(false);
													}.bind(this),
												});

											} else {
												console.log("T_OC_DET ELIMINAR");
												for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
													if (listItemFacturaPosicion[d4].US_RUC != undefined) { //GM26102021V2 incio
														var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
														if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
															//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
															var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
																//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
															var llaveActualizar = {};
															llaveActualizar.DE_FLAC = '';
															console.log(actOrdenCompra);
															oModelOData.update(actOrdenCompra, llaveActualizar, {
																method: "PUT",
																success: function (response) {
																	this.varContTabla4++;
																	if (this.varContTabla4 === listItemFacturaPosicion.length) {
																		console.log("T_FAC_POS ELIMINA2R");
																		for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																			var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																				"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																				"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																				"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																				"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																				"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																				"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																				"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																				//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																				"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																											this.getRouter().navTo("Vista_Menu_Principal");
																										}.bind(this)
																									}),
																									afterClose: function () {
																										dialogA.destroy();
																									}
																								});
																								dialogA.open();

																								this.getView().setBusy(false);
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
																											this.getRouter().navTo("Vista_Menu_Principal");
																										}.bind(this)
																									}),
																									afterClose: function () {
																										dialogA.destroy();
																									}
																								});
																								dialogA.open();

																								this.getView().setBusy(false);
																							}.bind(this),
																						});
																					}
																				}.bind(this),
																				error: function (data) {
																					this.getView().setBusy(false);
																					console.log(data);
																				}.bind(this)
																			});

																		}
																	}
																}.bind(this),
																error: function (response) {
																	console.log(response);
																	this.getView().setBusy(false);
																	if (this.varEstado4 === "V") {
																		this.varEstado4 = "E";
																		this.funValidarConteoDeRegistros();
																	}
																}.bind(this)
															});
														}
													} //GM26102021V2 fin
													//GM26102021 inicio
													else {
														console.log(listItemFacturaPosicion[d4]);
														var dialogA = new sap.m.Dialog({
															title: 'Error',
															type: 'Message',
															state: 'Error',
															icon: "sap-icon://error",
															content: new sap.m.Text({
																text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
															}),
															beginButton: new sap.m.Button({
																text: 'Aceptar',
																icon: "sap-icon://accept",
																type: "Accept",
																press: function () {
																	dialogA.close();
																	this.getRouter().navTo("Vista_Menu_Principal");
																}.bind(this)
															}),
															afterClose: function () {
																dialogA.destroy();
															}
														});
														dialogA.open();
														this.getView().setBusy(false);
													}
													//GM26102021 fin
												}
											}

										} else {
											for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
												//var detOrdenCompra = "/T_FAC_DETs(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
												if (listItemFacturas[d3].ID_FACTURA != undefined) {
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
																console.log("T_FAC_POS ELIMINAR");
																for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
																	if (listItemFacturaPosicion[d4].US_RUC != undefined) {
																		var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																		if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																			//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																			var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																				"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																				"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
																				//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																				"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																				"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																				"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																				"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
																			var llaveActualizar = {};
																			llaveActualizar.DE_FLAC = '';
																			console.log(actOrdenCompra);
																			oModelOData.update(actOrdenCompra, llaveActualizar, {
																				method: "PUT",
																				success: function (response) {
																					this.varContTabla4++;
																					if (this.varContTabla4 === listItemFacturaPosicion.length) {
																						console.log("T_FAC_POS ELIMINA2R");
																						for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																							var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																								"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																								"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																								"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																								"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																								"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																								"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																								"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																								//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																								"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																															this.getRouter().navTo("Vista_Menu_Principal");
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();

																												this.getView().setBusy(false);
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
																															this.getRouter().navTo("Vista_Menu_Principal");
																														}.bind(this)
																													}),
																													afterClose: function () {
																														dialogA.destroy();
																													}
																												});
																												dialogA.open();

																												this.getView().setBusy(false);
																											}.bind(this),
																										});
																									}
																								}.bind(this),
																								error: function (data) {
																									this.getView().setBusy(false);
																									console.log(data);
																								}.bind(this)
																							});

																						}
																					}
																				}.bind(this),
																				error: function (response) {
																					console.log(response);
																					this.getView().setBusy(false);
																					if (this.varEstado4 === "V") {
																						this.varEstado4 = "E";
																						this.funValidarConteoDeRegistros();
																					}
																				}.bind(this)
																			});
																		}
																	}
																	//GM26102021 inicio
																	else {
																		console.log(listItemFacturaPosicion[d4]);
																		var dialogA = new sap.m.Dialog({
																			title: 'Error',
																			type: 'Message',
																			state: 'Error',
																			icon: "sap-icon://error",
																			content: new sap.m.Text({
																				text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
																			}),
																			beginButton: new sap.m.Button({
																				text: 'Aceptar',
																				icon: "sap-icon://accept",
																				type: "Accept",
																				press: function () {
																					dialogA.close();
																					this.getRouter().navTo("Vista_Menu_Principal");
																				}.bind(this)
																			}),
																			afterClose: function () {
																				dialogA.destroy();
																			}
																		});
																		dialogA.open();
																		this.getView().setBusy(false);
																	}
																	//GM26102021 fin
																}
															}
														}.bind(this),
														error: function (response) {
															console.log(response);
															if (this.varEstado3 === "V") {
																this.varEstado3 = "E";
																this.funValidarConteoDeRegistros();
																this.getView().setBusy(false);

															}
														}.bind(this)
													});
												} else {
													console.log(listItemFacturas[d3]);
													var dialogA = new sap.m.Dialog({
														title: 'Error',
														type: 'Message',
														state: 'Error',
														icon: "sap-icon://error",
														content: new sap.m.Text({
															text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
														}),
														beginButton: new sap.m.Button({
															text: 'Aceptar',
															icon: "sap-icon://accept",
															type: "Accept",
															press: function () {
																dialogA.close();
																this.getRouter().navTo("Vista_Menu_Principal");
															}.bind(this)
														}),
														afterClose: function () {
															dialogA.destroy();
														}
													});
													dialogA.open();
													this.getView().setBusy(false);
												}

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

									}
								}.bind(this)
							});
						} else {
							this.varEstado2 = "E";
							this.funValidarConteoDeRegistros();
							this.getView().setBusy(false);

						}
					} else {
						console.log("T_DOC ELIMINAR");
						var documento = "/" + this.varTableT_DOC + "(EM_RUC='" + listDocAdjuntarFac[d1].EM_RUC +
							"',US_RUC='" + listDocAdjuntarFac[d1].US_RUC +
							"',ID_FACTURA='" + listDocAdjuntarFac[d1].ID_FACTURA +
							"',POS_DOCUMENTO='" + listDocAdjuntarFac[d1].POS_DOCUMENTO + "')";
						console.log(documento);
						oModelOData.remove(documento, {
							success: function (response) {
								this.varContTabla2++;
								if (this.varContTabla2 === listDocAdjuntarFac.length) {
									console.log("T_FAC_DET ELIMINAR");
									console.log(listItemFacturas);
									if (listItemFacturas.length === 0) {

										console.log("T_FAC_POS ELIMINAR");
										if (listItemFacturaPosicion.length === 0) {
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
																this.getRouter().navTo("Vista_Menu_Principal");
															}.bind(this)
														}),
														afterClose: function () {
															dialogA.destroy();
														}
													});
													dialogA.open();

													this.getView().setBusy(false);
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
																this.getRouter().navTo("Vista_Menu_Principal");
															}.bind(this)
														}),
														afterClose: function () {
															dialogA.destroy();
														}
													});
													dialogA.open();

													this.getView().setBusy(false);
												}.bind(this),
											});

										} else {
											for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
												if (listItemFacturaPosicion[d4].US_RUC != undefined) {
													var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
													if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
														//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
														var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
															"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
															"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
															//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
															"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
															"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
															"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
															"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
														var llaveActualizar = {};
														llaveActualizar.DE_FLAC = '';
														console.log(actOrdenCompra);
														oModelOData.update(actOrdenCompra, llaveActualizar, {
															method: "PUT",
															success: function (response) {
																this.varContTabla4++;
																if (this.varContTabla4 === listItemFacturaPosicion.length) {
																	console.log("T_FAC_POS ELIMINA2R");
																	for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																		var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																			"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																			"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																			"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																			"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																			"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																			"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																			"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																			//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																			"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																										this.getRouter().navTo("Vista_Menu_Principal");
																									}.bind(this)
																								}),
																								afterClose: function () {
																									dialogA.destroy();
																								}
																							});
																							dialogA.open();

																							this.getView().setBusy(false);
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
																										this.getRouter().navTo("Vista_Menu_Principal");
																									}.bind(this)
																								}),
																								afterClose: function () {
																									dialogA.destroy();
																								}
																							});
																							dialogA.open();

																							this.getView().setBusy(false);
																						}.bind(this),
																					});
																				}
																			}.bind(this),
																			error: function (data) {
																				this.getView().setBusy(false);
																				console.log(data);
																			}.bind(this)
																		});

																	}
																}
															}.bind(this),
															error: function (response) {
																console.log(response);
																this.getView().setBusy(false);
																if (this.varEstado4 === "V") {
																	this.varEstado4 = "E";
																	this.funValidarConteoDeRegistros();
																}
															}.bind(this)
														});
													}
												}
												//GM26102021 inicio
												else {
													console.log(listItemFacturaPosicion[d4]);
													var dialogA = new sap.m.Dialog({
														title: 'Error',
														type: 'Message',
														state: 'Error',
														icon: "sap-icon://error",
														content: new sap.m.Text({
															text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
														}),
														beginButton: new sap.m.Button({
															text: 'Aceptar',
															icon: "sap-icon://accept",
															type: "Accept",
															press: function () {
																dialogA.close();
																this.getRouter().navTo("Vista_Menu_Principal");
															}.bind(this)
														}),
														afterClose: function () {
															dialogA.destroy();
														}
													});
													dialogA.open();
													this.getView().setBusy(false);
												}
												//GM26102021 fin
											}
										}

									} else {
										for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
											//var detOrdenCompra = "/T_FAC_DETs(EM_RUC='" + listItemFacturas[i].EM_RUC.toString() +
											if (listItemFacturas[d3].ID_FACTURA != undefined) {
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
															console.log("T_FAC_POS ELIMINAR");
															for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
																if (listItemFacturaPosicion[d4].US_RUC != undefined) {
																	var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
																	if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
																		//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
																		var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
																			"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
																			"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
																			//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																			"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
																			"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].OC_NUMERO_ORDEN +
																			"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
																			"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
																		var llaveActualizar = {};
																		llaveActualizar.DE_FLAC = '';
																		console.log(actOrdenCompra);
																		oModelOData.update(actOrdenCompra, llaveActualizar, {
																			method: "PUT",
																			success: function (response) {
																				this.varContTabla4++;
																				if (this.varContTabla4 === listItemFacturaPosicion.length) {
																					console.log("T_FAC_POS ELIMINA2R");
																					for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																						var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																							"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																							"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																							"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																							"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																							"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																							"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																							"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																							//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																							"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																														this.getRouter().navTo("Vista_Menu_Principal");
																													}.bind(this)
																												}),
																												afterClose: function () {
																													dialogA.destroy();
																												}
																											});
																											dialogA.open();

																											this.getView().setBusy(false);
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
																														this.getRouter().navTo("Vista_Menu_Principal");
																													}.bind(this)
																												}),
																												afterClose: function () {
																													dialogA.destroy();
																												}
																											});
																											dialogA.open();

																											this.getView().setBusy(false);
																										}.bind(this),
																									});
																								}
																							}.bind(this),
																							error: function (data) {
																								this.getView().setBusy(false);
																								console.log(data);
																							}.bind(this)
																						});

																					}
																				}
																			}.bind(this),
																			error: function (response) {
																				console.log(response);
																				this.getView().setBusy(false);
																				if (this.varEstado4 === "V") {
																					this.varEstado4 = "E";
																					this.funValidarConteoDeRegistros();
																				}
																			}.bind(this)
																		});
																	}
																}
																//GM26102021 inicio
																else {
																	console.log(listItemFacturaPosicion[d4]);
																	var dialogA = new sap.m.Dialog({
																		title: 'Error',
																		type: 'Message',
																		state: 'Error',
																		icon: "sap-icon://error",
																		content: new sap.m.Text({
																			text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
																		}),
																		beginButton: new sap.m.Button({
																			text: 'Aceptar',
																			icon: "sap-icon://accept",
																			type: "Accept",
																			press: function () {
																				dialogA.close();
																				this.getRouter().navTo("Vista_Menu_Principal");
																			}.bind(this)
																		}),
																		afterClose: function () {
																			dialogA.destroy();
																		}
																	});
																	dialogA.open();
																	this.getView().setBusy(false);
																}
																//GM26102021 fin
															}
														}
													}.bind(this),
													error: function (response) {
														console.log(response);
														if (this.varEstado3 === "V") {
															this.varEstado3 = "E";
															this.funValidarConteoDeRegistros();
															this.getView().setBusy(false);

														}
													}.bind(this)
												});
											} else {
												console.log(listItemFacturas[d3]);
												var dialogA = new sap.m.Dialog({
													title: 'Error',
													type: 'Message',
													state: 'Error',
													icon: "sap-icon://error",
													content: new sap.m.Text({
														text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
													}),
													beginButton: new sap.m.Button({
														text: 'Aceptar',
														icon: "sap-icon://accept",
														type: "Accept",
														press: function () {
															dialogA.close();
															this.getRouter().navTo("Vista_Menu_Principal");
														}.bind(this)
													}),
													afterClose: function () {
														dialogA.destroy();
													}
												});
												dialogA.open();
												this.getView().setBusy(false);
											}
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

								}
							}.bind(this)
						});
					}
				}
			} else {
				console.log("OTRO");
				if (listItemFacturas.length !== 0) {
					for (var d3 = 0; d3 < listItemFacturas.length; d3++) {
						if (listItemFacturas[d3].ID_FACTURA != undefined) {
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
											if (listItemFacturaPosicion[d4].US_RUC != undefined) {
												var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
												if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
													//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
													var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
														"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
														"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
														//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
														"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
														"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].DE_NUMERO_ORDEN +
														"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
														"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
													var llaveActualizar = {};
													llaveActualizar.DE_FLAC = '';
													console.log(actOrdenCompra);
													oModelOData.update(actOrdenCompra, llaveActualizar, {
														method: "PUT",
														success: function (response) {
															this.varContTabla4++;
															if (this.varContTabla4 === listItemFacturaPosicion.length) {
																console.log("T_FAC_POS ELIMINA2R");
																for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
																	var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
																		"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
																		"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
																		"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
																		"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
																		"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
																		"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
																		"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
																		//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
																		"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																									this.getRouter().navTo("Vista_Menu_Principal");
																								}.bind(this)
																							}),
																							afterClose: function () {
																								dialogA.destroy();
																							}
																						});
																						dialogA.open();

																						this.getView().setBusy(false);
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
																									this.getRouter().navTo("Vista_Menu_Principal");
																								}.bind(this)
																							}),
																							afterClose: function () {
																								dialogA.destroy();
																							}
																						});
																						dialogA.open();

																						this.getView().setBusy(false);
																					}.bind(this),
																				});
																			}
																		}.bind(this),
																		error: function (data) {
																			this.getView().setBusy(false);
																			console.log(data);
																		}.bind(this)
																	});

																}
															}
														}.bind(this),
														error: function (response) {
															console.log(response);
															this.getView().setBusy(false);
															if (this.varEstado4 === "V") {
																this.varEstado4 = "E";
																this.funValidarConteoDeRegistros();
															}
														}.bind(this)
													});
												}
											}
											//GM26102021 inicio
											else {
												console.log(listItemFacturaPosicion[d4]);
												var dialogA = new sap.m.Dialog({
													title: 'Error',
													type: 'Message',
													state: 'Error',
													icon: "sap-icon://error",
													content: new sap.m.Text({
														text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
													}),
													beginButton: new sap.m.Button({
														text: 'Aceptar',
														icon: "sap-icon://accept",
														type: "Accept",
														press: function () {
															dialogA.close();
															this.getRouter().navTo("Vista_Menu_Principal");
														}.bind(this)
													}),
													afterClose: function () {
														dialogA.destroy();
													}
												});
												dialogA.open();
												this.getView().setBusy(false);
											}
											//GM26102021 fin
										}
									}
								}.bind(this),
								error: function (response) {
									if (this.varEstado3 === "V") {
										this.varEstado3 = "E";
										this.funValidarConteoDeRegistros();
										this.getView().setBusy(false);

									}
								}.bind(this)
							});
						} else {
							console.log(listItemFacturas[d3]);
							var dialogA = new sap.m.Dialog({
								title: 'Error',
								type: 'Message',
								state: 'Error',
								icon: "sap-icon://error",
								content: new sap.m.Text({
									text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
								}),
								beginButton: new sap.m.Button({
									text: 'Aceptar',
									icon: "sap-icon://accept",
									type: "Accept",
									press: function () {
										dialogA.close();
										this.getRouter().navTo("Vista_Menu_Principal");
									}.bind(this)
								}),
								afterClose: function () {
									dialogA.destroy();
								}
							});
							dialogA.open();
							this.getView().setBusy(false);
						}

					}
				} else {
					if (listItemFacturaPosicion.length !== 0) {
						for (var d4 = 0; d4 < listItemFacturaPosicion.length; d4++) {
							if (listItemFacturaPosicion[d4].US_RUC != undefined) {
								var varTipoCargaDefinir = oModel.getProperty("/listConsultaResumenFactura/TIPO_CARGA");
								if (varTipoCargaDefinir === "S" || varTipoCargaDefinir === "H" || varTipoCargaDefinir === "D") {
									//var actOrdenCompra = "/T_OC_DETs(EM_RUC='" + listItemFacturaPosicion[j].EM_RUC + "',US_RUC='" + listItemFacturaPosicion[j].US_RUC +
									var actOrdenCompra = "/" + this.varTableT_OC_DET + "(EM_RUC='" + listItemFacturaPosicion[d4].EM_RUC +
										"',US_RUC='" + listItemFacturaPosicion[d4].US_RUC +
										"',DE_POSICION='" + listItemFacturaPosicion[d4].DE_POSICION +
										//"',DE_GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
										"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_DOC_MATERIAL +
										"',DE_NUMERO_ORDEN='" + listItemFacturaPosicion[d4].DE_NUMERO_ORDEN +
										"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d4].DE_HOJA_ENTRADA +
										"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d4].DE_POS_DOC_MATERIAL + "')";
									var llaveActualizar = {};
									llaveActualizar.DE_FLAC = '';
									console.log(actOrdenCompra);
									oModelOData.update(actOrdenCompra, llaveActualizar, {
										method: "PUT",
										success: function (response) {
											this.varContTabla4++;
											if (this.varContTabla4 === listItemFacturaPosicion.length) {
												console.log("T_FAC_POS ELIMINA2R");
												for (var d5 = 0; d5 < listItemFacturaPosicion.length; d5++) {
													var detOrdenCompra = "/" + this.varTableT_FAC_POS + "(EM_RUC='" + listItemFacturaPosicion[d5].EM_RUC +
														"',US_RUC='" + listItemFacturaPosicion[d5].US_RUC +
														"',ID_FACTURA='" + listItemFacturaPosicion[d5].ID_FACTURA +
														"',POS_FACTURA='" + listItemFacturaPosicion[d5].POS_FACTURA +
														"',OC_NUMERO_ORDEN='" + listItemFacturaPosicion[d5].OC_NUMERO_ORDEN +
														"',DE_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_DOC_MATERIAL +
														"',DE_HOJA_ENTRADA='" + listItemFacturaPosicion[d5].DE_HOJA_ENTRADA +
														"',DE_POS_DOC_MATERIAL='" + listItemFacturaPosicion[d5].DE_POS_DOC_MATERIAL +
														//"',GUIA_REMISION='" + listItemFacturaPosicion[d5].GUIA_REMISION +
														"',DE_POSICION='" + listItemFacturaPosicion[d5].DE_POSICION + "')";
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
																					this.getRouter().navTo("Vista_Menu_Principal");
																				}.bind(this)
																			}),
																			afterClose: function () {
																				dialogA.destroy();
																			}
																		});
																		dialogA.open();

																		this.getView().setBusy(false);
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
																					this.getRouter().navTo("Vista_Menu_Principal");
																				}.bind(this)
																			}),
																			afterClose: function () {
																				dialogA.destroy();
																			}
																		});
																		dialogA.open();

																		this.getView().setBusy(false);
																	}.bind(this),
																});
															}
														}.bind(this),
														error: function (data) {
															this.getView().setBusy(false);
															console.log(data);
														}.bind(this)
													});

												}
											}
										}.bind(this),
										error: function (response) {
											console.log(response);
											this.getView().setBusy(false);
											if (this.varEstado4 === "V") {
												this.varEstado4 = "E";
												this.funValidarConteoDeRegistros();
											}
										}.bind(this)
									});
								}
							}
							//GM26102021 inicio
							else {
								console.log(listItemFacturas[d4]);
								var dialogA = new sap.m.Dialog({
									title: 'Error',
									type: 'Message',
									state: 'Error',
									icon: "sap-icon://error",
									content: new sap.m.Text({
										text: "Ocurrió un problema al eliminar, por favor hacerlo desde el reporte de factura"
									}),
									beginButton: new sap.m.Button({
										text: 'Aceptar',
										icon: "sap-icon://accept",
										type: "Accept",
										press: function () {
											dialogA.close();
											this.getRouter().navTo("Vista_Menu_Principal");
										}.bind(this)
									}),
									afterClose: function () {
										dialogA.destroy();
									}
								});
								dialogA.open();
								this.getView().setBusy(false);
							}
							//GM26102021 fin
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
											this.getRouter().navTo("Vista_Menu_Principal");
										}.bind(this)
									}),
									afterClose: function () {
										dialogA.destroy();
									}
								});
								dialogA.open();

								this.getView().setBusy(false);

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
											this.getRouter().navTo("Vista_Menu_Principal");
										}.bind(this)
									}),
									afterClose: function () {
										dialogA.destroy();
									}
								});
								dialogA.open();

								this.getView().setBusy(false);

							}.bind(this),
						});
					}
				}
			}

		},
		funValidarConteoDeRegistros: function () {

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
							this.getRouter().navTo("Vista_Menu_Principal");
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
							this.getRouter().navTo("Vista_Menu_Principal");
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
							this.getRouter().navTo("Vista_Menu_Principal");
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
							this.getRouter().navTo("Vista_Menu_Principal");
						}.bind(this)
					}),
					afterClose: function () {
						dialogA.destroy();
					}
				});
				dialogA.open();
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
				error: function (oError) {}.bind(this)
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

			if (this.varEstadoSunat1 === "X") {
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
									this.varContValidar = 0; // MAURO 20211014

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
										this.getView().byId("idValidacionFacySunat1").setText("Error al validar con la SUNAT para la factura : " + parte1 +
											"-" +
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
			} else {
				this.getView().byId("idValidacionFacySunat1").setType("Success");
				this.getView().byId("idValidacionFacySunat2").setType("Success");
				this.getView().byId("idValidacionFacySunat3").setType("Success");
			}
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
					var numMayor = 0;
					for (var i = 0; i < vectorFinal.length; i++) {
						var nombre = vectorFinal[i].name;
						if (nombre.includes(fileTexto) && nombre.includes(formatoTexto)) {
							if (nombre.includes("(") && nombre.includes(")")) {
								var nombreSplit = nombre.split("(");
								nombreSplit = nombreSplit[1];
								nombreSplit = nombreSplit.split(")");
								nombreSplit = nombreSplit[0];
								if (parseInt(nombreSplit) > numMayor) {
									numMayor = parseInt(nombreSplit);
								}
							}
							cont++;
						}
					}
					if (numMayor !== 0) {
						cont = numMayor;
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
					console.log(err);
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
			if (varSelecTipoCarga === "S") {
				varDocumentosObli = "( 01 ó 08 - xml ) y 01 - pdf"; // MAURO 20211014
			} else if (varSelecTipoCarga === "H") {
				varDocumentosObli = "( 01 ó 08 - xml ) y 01 - pdf";
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
					}.bind(this)
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
							sap.ui.getCore().byId("idAceptar").setEnabled(true);
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
					new sap.m.Button("idAceptar", {
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

								var varTamanoDeArchivo = file.size;

								if (varTamanoDeArchivo !== 0) {
									sap.ui.getCore().byId("idAceptar").setEnabled(false);
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
												var numMayor = 0;
												for (var i = 0; i < vectorFinal.length; i++) {
													var nombre = vectorFinal[i].name;
													if (nombre.includes(fileTexto) && nombre.includes(formatoTexto)) {
														if (nombre.includes("(") && nombre.includes(")")) {
															var nombreSplit = nombre.split("(");
															nombreSplit = nombreSplit[1];
															nombreSplit = nombreSplit.split(")");
															nombreSplit = nombreSplit[0];
															if (parseInt(nombreSplit) > numMayor) {
																numMayor = parseInt(nombreSplit);
															}
														}
														cont++;
													}
												}
												if (numMayor !== 0) {
													cont = numMayor;
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
												console.log(err);
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
											text: "Se requiere seleccionar un documento no vacío."

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
								dialog.setBusy(false);
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
								if (this.getView().byId("idComboTipo").getSelectedItem().getKey() === "S") {

									var contTipo = 0;
									for (var k = 0; k < vartamtblDocOK; k++) {
										var opcFiltro = oModel.getProperty("/listTablaDocumentos/" + k + "/clistTabDocuTipo");
										var opcFiltroExtension = oModel.getProperty("/listTablaDocumentos/" + k + "/clistTabDocuExension");
										if ((opcFiltro === "01" || opcFiltro === "08") && opcFiltroExtension === "text/xml") {
											contTipo = contTipo + 1;
										}
										/*else if (opcFiltro === "GR" && opcFiltroExtension === "application/pdf") { // MAURO 20211014
											contTipo = contTipo + 1;
										}*/
										else if (opcFiltro === "01" && opcFiltroExtension === "application/pdf") {
											contTipo = contTipo + 1;
										}
									}

									if (contTipo < 2) { // MAURO 20211014

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
								} else if (this.getView().byId("idComboTipo").getSelectedItem().getKey() === "H") {

									var contTipo = 0;
									for (var k = 0; k < vartamtblDocOK; k++) {
										var opcFiltro = oModel.getProperty("/listTablaDocumentos/" + k + "/clistTabDocuTipo");
										var opcFiltroExtension = oModel.getProperty("/listTablaDocumentos/" + k + "/clistTabDocuExension");
										if ((opcFiltro === "01" || opcFiltro === "08") && opcFiltroExtension === "text/xml") {
											contTipo = contTipo + 1;
										} else if (opcFiltro === "01" && opcFiltroExtension === "application/pdf") {
											contTipo = contTipo + 1;
										}
									}
									this.varGlobalContDocu = contTipo;

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
				/*endButton: new sap.m.Button({
					text: 'Cancelar',
					type: 'Emphasized',
					press: function () {

						var vartamtblDocOK = oModel.getProperty("/listTablaDocumentos").length;
						if (this.varGlobalContDocu < 3) {
							oModel.setProperty("/listTablaDocumentos", []);
							this.getView().byId("idValidacionDoc").setText("Se requiere asignar todos los Documentos Sustentos de la factura.");
							this.getView().byId("idValidacionDoc").setType("Warning");
							this.getView().byId("idFacturar").setEnabled(false);
							dialog.close();
						} else {

							this.getView().byId("idValidacionDoc").setText("Todos los Documentos Sustentos de la factura asignadas.");
							this.getView().byId("idValidacionDoc").setType("Success");
							this.getView().byId("idFacturar").setEnabled(true);
							dialog.close();
						}

						var vattbl2 = oModel.getProperty("/listTablaDocumentosTemp");
						oModel.setProperty("/listTablaDocumentos", vattbl2);

						dialog.close();
					}.bind(this)
				}),*/
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		encode_utf8: function (s) {
			return unescape(encodeURIComponent(s));
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
							vector[i].clistTabDocuNumero.replace(/^(0+)/g, '') === varNumComprobante.replace(/^(0+)/g, '') && //GM0411
							vector[i].clistTabDocuExension === varExtension) {
							varRespuesta = 1;
						}
					}

					if (varRespuesta === 0) {} else {}
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
		},

		funEliminarCeros: function (valor) {
			if (valor !== "" && valor !== null && valor !== undefined) {
				//valor = parseFloat(valor, 10).toFixed(2);
				//valor = valor.toString();
				var opc = 1;
				var varResulTexto = "";
				for (var i = 0; i < valor.length; i++) {
					if (opc !== 0) {
						if (valor.substring(i, i + 1) !== "0") {
							varResulTexto = varResulTexto + valor.substring(i, i + 1);
							opc = 0;
						}
					} else {
						varResulTexto = varResulTexto + valor.substring(i, i + 1);
					}
				}
				return varResulTexto;
			} else {
				return "";
			}
		}

	});

});