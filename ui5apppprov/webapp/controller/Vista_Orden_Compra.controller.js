sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict"; 

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Orden_Compra", {
		ordenCompraDet: null, 
		objectoPrev: null,
		pressEliminarFactura: function () {
			this.getView().setBusy(true);
			var url = "/odatabnv/odata2.svc/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var oModelmyParam = this.getView().getModel("myParam");
			var listItemFacturas = oModelmyParam.getProperty("/listItemFacturas");
			var listDocAdjuntarFac = oModelmyParam.getProperty("/listDocAdjuntarFac");
			var objeto = this.getView().byId("ohFac").getBindingContext("myParam").getObject();

		
			var ordenCompra = "/tb_orden_compra_prev(OC_NUMERO_ORDEN='" + objeto.OC_NUMERO_ORDEN + "',OC_ID_FACTURA='" + objeto.OC_ID_FACTURA +
				"')";
			oModelJson.remove(ordenCompra, {
				success: function (response) {
						for (var i = 0; i < listItemFacturas.length; i++) {
				var detOrdenCompra = "/tb_detalle_prev(DE_POSICION='" + listItemFacturas[i].DE_POSICION + "',DE_NUMERO_ORDEN='" + listItemFacturas[
						i].DE_NUMERO_ORDEN + "',ID_FACTURA='" + objeto.OC_ID_FACTURA +
					"')";
				oModelJson.remove(detOrdenCompra, {
					success: function (response) {
					},
					error: function (response) {
					}
				});
			}
			for (var d = 0; d < listDocAdjuntarFac.length; d++) {
				var documento = "/tb_documento(NUMERO_ORDEN='" + listDocAdjuntarFac[d].NUMERO_ORDEN + "',ID_FACTURA='" + listDocAdjuntarFac[d].ID_FACTURA +
					"',POS_DOCUMENTO='" + listDocAdjuntarFac[d].POS_DOCUMENTO + "')";
				oModelJson.remove(documento, {
					success: function (response) {
					},
					error: function (response) {
					}
				});
			}
		this.getView().setBusy(false);
			var dialog = new sap.m.Dialog({
								title: "Éxito",
								type: "Message",
								state: "Success",
								icon: "sap-icon://expense-report",
								content: new sap.m.Text({
									text: "Se eliminó la factura " + objeto.OC_ID_FACTURA + " y sus componentes correctamente."

								}),
								beginButton: new sap.m.Button({
									text: "Aceptar",
									press: function () {
											this.inicioListaFacturaOrdenesCompraRe();
										dialog.close();
									}.bind(this)
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});
							dialog.open();
				}.bind(this),
				error: function (response) {
					this.getView().setBusy(false);
						var dialog = new sap.m.Dialog({
								title: "Error",
								type: "Message",
								state: "Error",
								icon: "sap-icon://expense-report",
								content: new sap.m.Text({
									text: "No se pudo eliminar la factura " + objeto.OC_ID_FACTURA + " junto a sus componentes."

								}),
								beginButton: new sap.m.Button({
									text: "Aceptar",
									press: function () {
										dialog.close();
									}
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});
							dialog.open();
				}
			});
		},
		onInit: function () {
			this.getRouter().getRoute("Vista_Orden_Compra").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("idTableItemEnProceso").setSelectionMode("Single");
			this.getView().byId("idTableItemEnProceso").setSelectionBehavior("RowOnly");
				this.getView().byId("idTableItemAceptado").setSelectionMode("Single");
			this.getView().byId("idTableItemAceptado").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemFacturado").setSelectionMode("Single");
			this.getView().byId("idTableItemFacturado").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemPendiente").setSelectionMode("Single");
			this.getView().byId("idTableItemPendiente").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemCronogramaEnProceso").setSelectionMode("Single");
			this.getView().byId("idTableItemCronogramaEnProceso").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemCronogramaEntregado").setSelectionMode("Single");
			this.getView().byId("idTableItemCronogramaEntregado").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemCronogramaAceptado").setSelectionMode("Single");
			this.getView().byId("idTableItemCronogramaAceptado").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemCronogramaFacturado").setSelectionMode("Single");
			this.getView().byId("idTableItemCronogramaFacturado").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemFacturas").setSelectionMode("Single");
			this.getView().byId("idTableItemFacturas").setSelectionBehavior("RowOnly");
			this.getView().byId("idTableItemCronogramaPendiente").setSelectionMode("Single");
			this.getView().byId("idTableItemCronogramaPendiente").setSelectionBehavior("RowOnly");
			
			this.getView().byId("idTableItemEntregado").setSelectionMode("Single");
			this.getView().byId("idTableItemEntregado").setSelectionBehavior("RowOnly");
			
				this.getView().byId("idLogOff").addStyleClass("miIconoBlanco");
					this.getView().byId("pag1").addStyleClass("miFechaFondo");
						this.getView().byId("pag2").addStyleClass("miFechaFondo");
						
						
							this.getView().byId("idGridEnt").addStyleClass("miGrid");
								this.getView().byId("idGridPro").addStyleClass("miGrid");
									this.getView().byId("idGridEn").addStyleClass("miGrid");
										this.getView().byId("idGridAce").addStyleClass("miGrid");
						
						
			this.getView().byId("idFilterSection").addStyleClass("miSeccionBlanca");
					this.getView().byId("idNavMenu").addStyleClass("miIconoBlanco");
						this.getView().byId("idFiltro").addStyleClass("miIconoBlanco");
							this.getView().byId("idNavOC").addStyleClass("miIconoBlanco");
						this.getView().byId("idFilter2").addStyleClass("miIconoBlanco");

			var oProductDetail1PanelCabecera = this.getView().byId("oh1");
			oProductDetail1PanelCabecera.setVisible(false);

			var oProductDetail1PanelIconBar = this.getView().byId("idIconTabBarSeparatorMixed");
			oProductDetail1PanelIconBar.setVisible(false);
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
		onAfterRendering: function () {

			this.inicioListaOrdenesCompra();

			// Inicio de todas las tablas
			//this.InicioTotal();
			this.getView().byId("idPanelPorFecha").setVisible(false);
			this.getView().byId("idPanelPorSituacion").setVisible(false);
			this.getView().byId("idPanelPorEstado").setVisible(false);
			var llave = this.getView().byId("idIconTabBarSeparatorMixed").getSelectedKey().toString();
				this.getView().byId("idButtonFac").setVisible(true);

			var idComboSituacion = this.getView().byId("idSituacion");
			var idComboEstado = this.getView().byId("idEstado");
			idComboSituacion.getBinding("items").refresh(true);
			var firstItem = idComboSituacion.getItems()[0];
			idComboSituacion.setSelectedItem(firstItem, true);

			idComboEstado.getBinding("items").refresh(true);
			firstItem = idComboEstado.getItems()[0];
			idComboEstado.setSelectedItem(firstItem, true);
		},
selectEventIcon: function () {

			var llave = this.getView().byId("idIconTabBarSeparatorMixed").getSelectedKey().toString();
				this.getView().byId("idButtonFac").setVisible(true);
		},
		_onRouteMatched: function () {
		var llave = this.getView().byId("idIconTabBarSeparatorMixed").getSelectedKey().toString();
				this.getView().byId("idButtonFac").setVisible(true);
			var oView = this.getView();
			var oModel = oView.getModel("myParam");

			oView.setModel(oModel);
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

		btnRegresarMenu: function () {

			this.getRouter().navTo("Vista_Menu_Principal");
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

		convertirDecimal: function (valor) {

			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});

			return oNumberFormat.format(valor);
		},

		btnSelectFactura: function () {

			var llave = this.getView().byId("idIconTabBarSeparatorMixed").getSelectedKey().toString();
			// if (llave === "Facturado") {
			// 	this.btnSelectFactura4();
			// } else if (llave === "Entregado") {
				this.btnSelectFactura3();
			// }

			var oModel = this.getView().getModel("myParam");
			oModel.setProperty("/listItemDetalleFactura", []);
			oModel.setProperty("/listVizualizarDetFacEntregado", []);
			oModel.setProperty("/listItemCronFacEntregado", []);
			oModel.setProperty("/listVizualizarDetFacAceptado", []);
			oModel.setProperty("/listItemCronFacAceptado", []);
		},
			inicioListaFacturaOrdenesCompraRe: function () {
				this.getView().byId("ohFac").setVisible(false);
			this.getView().byId("idTabBarFac").setVisible(false);
			this.getView().byId("master3").setBusy(true);
			var ordenCompra = this.ordenCompraDet;

			this.getView().byId("idListMaster3").setHeaderText("O/C : " + ordenCompra.cOrdenCompraNum);

			var url = "/odatabnv/odata2.svc/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrix = [];
			var registro = {};
			var oThis = this;
			var oModel2 = oThis.getView().getModel("myParam");

			// Mostrar JSON
			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("OC_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, ordenCompra.cOrdenCompraNum);
			filters.push(filter);
			oModel.read("/tb_orden_compra_prev?$format=json", {
				filters: filters,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

					var lenghtV = oModelJSON.getData().length;

					oModel2.setProperty("/listOrdenCompraFactura", oModelJSON.getData());
					this.getView().byId("idTituloFactura").setText("Facturas previas (" + lenghtV + ")");
					this.getView().byId("master3").setBusy(false);
					this.getView().byId("idListMaster3").getBinding("items").refresh(true);
					sap.m.MessageToast.show("Se realizó la búsqueda con éxito.");
				}.bind(this),
				error: function (oError) {
					this.getView().byId("idTituloFactura").setText("Facturas previas (0)");
					this.getView().byId("master3").setBusy(false);
					this.getView().byId("idListMaster3").getBinding("items").refresh(true);
				}.bind(this)
			});

			this.getSplitAppObj().toMaster(this.createId("master3"));

		},
		inicioListaFacturaOrdenesCompra: function (oEvent) {
			this.getView().byId("master3").setBusy(true);
			var itemSeleccionado = oEvent.getSource().getSelectedItem();
			var ordenCompra = itemSeleccionado.getBindingContext("myParam").getObject();
			this.ordenCompraDet = ordenCompra;
			this.getView().byId("idListMaster3").setHeaderText("O/C : " + ordenCompra.cOrdenCompraNum);

			var url = "/odatabnv/odata2.svc/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrix = [];
			var registro = {};
			var oThis = this;
			var oModel2 = oThis.getView().getModel("myParam");

			// Mostrar JSON
			var filters = [];
			var filter;
			filter = new sap.ui.model.Filter("OC_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, ordenCompra.cOrdenCompraNum);
			filters.push(filter);
			oModel.read("/tb_orden_compra_prev?$format=json", {
				filters: filters,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

					var lenghtV = oModelJSON.getData().length;

					oModel2.setProperty("/listOrdenCompraFactura", oModelJSON.getData());
					this.getView().byId("idTituloFactura").setText("Facturas previas (" + lenghtV + ")");
					this.getView().byId("master3").setBusy(false);
					this.getView().byId("idListMaster3").getBinding("items").refresh(true);
					sap.m.MessageToast.show("Se realizó la búsqueda con éxito.");
				}.bind(this),
				error: function (oError) {
					this.getView().byId("idTituloFactura").setText("Facturas previas (0)");
					this.getView().byId("master3").setBusy(false);
					this.getView().byId("idListMaster3").getBinding("items").refresh(true);
				}.bind(this)
			});

			this.getSplitAppObj().toMaster(this.createId("master3"));

		},
		inicioListaOrdenesCompra: function () {

			this.getView().byId("master1").setBusy(true);

			var url = "/odatabnv/odata2.svc/";
			var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrix = [];
			var registro = {};
			var oThis = this;
			var oModel2 = oThis.getView().getModel("myParam");

			// Mostrar JSON
			oModel.read("/T_OC?$format=json", {
				//filters: filters,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

					var lenghtV = oModelJSON.getData().length;

					for (var i = 0; i < lenghtV; i++) {
						registro = {};
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
					oModel2.setProperty("/listOrdenCompra", matrix);
					this.getView().byId("idTituloOrden").setText("Ordenes de Compra (" + lenghtV + ")");
					//oThis.getView().byId("idListMaster2").getBinding("items").refresh(true);
					this.getView().byId("master1").setBusy(false);
				}.bind(this),
				error: function (oError) {
					this.getView().byId("idTituloOrden").setText("Ordenes de Compra (0)");
					this.getView().byId("master1").setBusy(false);
				}.bind(this)
			});
		},

		btnFiltros: function () {
	this.getView().byId("idButtonFac").setVisible(false);
			this.getView().byId("idListMaster1").removeSelections(true);
			this.getView().byId("ohFac").setVisible(false);
			this.getView().byId("idTabBarFac").setVisible(false);
			var oProductDetail1PanelCabecera = this.getView().byId("oh1");
			oProductDetail1PanelCabecera.setVisible(false);

			var oProductDetail1PanelIconBar = this.getView().byId("idIconTabBarSeparatorMixed");
			oProductDetail1PanelIconBar.setVisible(false);

			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onSearch: function (oEvt) {

			// Añadir los filtros para buscar
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("cOrdenCompraNum", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// Actualiza la lista
			var list = this.byId("idListMaster1");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		onSearchFac: function (oEvt) {

			// Añadir los filtros para buscar
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("OC_ID_FACTURA", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// Actualiza la lista
			var list = this.byId("idListMaster3");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},

		btnSeleccionarFiltros: function () {

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			var oDialog = new sap.m.Dialog("Dialog2", {

				title: "Active/Desactive filtros",
				contentWidth: "200px",
				type: "Message",
				content: [
					new sap.m.CheckBox("idCheckFecha", {
						selected: oModel.getProperty("/listCheck").rFecha
					}),
					new sap.m.Label({
						text: "",
						width: "10%"
					}),
					new sap.m.Label({
						text: "Filtro por Fecha",
						width: "70%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.CheckBox("idCheckSituacion", {
						selected: oModel.getProperty("/listCheck").rSituacion
					}),
					new sap.m.Label({
						text: "",
						width: "10%"
					}),
					new sap.m.Label({
						text: "Filtro po Situación",
						width: "70%"
					}),
					new sap.m.Label({
						text: "",
						width: "100%"
					}),
					new sap.m.CheckBox("idCheckEstado", {
						selected: oModel.getProperty("/listCheck").rEstado
					}),
					new sap.m.Label({
						text: "",
						width: "10%"
					}),
					new sap.m.Label({
						text: "Filtro por Estado",
						width: "70%"
					})
				],
				afterClose: function () {
					oDialog.destroy();
				},
				beginButton: new sap.m.Button({
					text: 'Aceptar',
					type: 'Emphasized',
					icon: 'sap-icon://filter',
					press: function () {

						// Llamar modelo
						var oThis = this;
						var oModel = oThis.getView().getModel("myParam");

						var chkFecha = sap.ui.getCore().byId("idCheckFecha").getSelected();
						var chkSituacion = sap.ui.getCore().byId("idCheckSituacion").getSelected();
						var chkEstado = sap.ui.getCore().byId("idCheckEstado").getSelected();

						this.getView().byId("idPanelPorFecha").setVisible(chkFecha);
						this.getView().byId("idPanelPorSituacion").setVisible(chkSituacion);
						this.getView().byId("idPanelPorEstado").setVisible(chkEstado);
		
						var registroCheck = {};
						registroCheck.rFecha = chkFecha;
						registroCheck.rSituacion = chkSituacion;
						registroCheck.rEstado = chkEstado;

						oModel.setProperty("/listCheck", registroCheck);
						if (!chkFecha && !chkSituacion && !chkEstado) {
							this.getView().byId("idToolbarMensaje").setVisible(true);
							this.getView().byId("idPanelCheck").setVisible(false);
							this.getView().byId("idFiltroDes").setVisible(false);
						} else {
							this.getView().byId("idToolbarMensaje").setVisible(false);
							this.getView().byId("idPanelCheck").setVisible(true);
							this.getView().byId("idFiltroDes").setVisible(true);
						}
						oDialog.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: 'Cancelar',
					type: 'Emphasized',
					icon: 'sap-icon://sys-cancel',
					press: function () {
						oDialog.close();
					}.bind(this)
				}),
			});
			oDialog.open();
		},

		handleNav: function (evt) {

			var navCon = this.byId("navCon");
			var target = evt.getSource().data("target");
			if (target) {
				if (target === "pag1") {
					this.getView().byId("navCon").setHeight("4.2em");

				} else {
					this.getView().byId("navCon").setHeight("8.2em");
				}

				var animation = "flip";
				navCon.to(this.byId(target), animation);
			} else {
				navCon.back();
			}
		},

		btnRegresarMaster1: function () {

			this.getView().byId("master1").setBusy(true);
			var panelFiltro = this.getView().byId("idPanelCheck").getVisible();
			var seleccionado = this.getView().byId("idFiltroDes").getSelected();
				var oThis = this;
			var oModel = oThis.getView().getModel("myParam");
				var url = "/odatabnv/odata2.svc/";
			var oModelxd = new sap.ui.model.odata.v2.ODataModel(url, true);
				var matrix = [];
			var registro = {};
			if(panelFiltro && seleccionado){
					oModelxd.read("/T_OC?$format=json", {
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;

					for (var i = 0; i < lenghtV; i++) {
						registro = {};
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
					this.getView().byId("master1").setBusy(false);
					this.getView().byId("idTituloOrden").setText("Ordenes de Compra (" + lenghtV + ")");
					//oThis.getView().byId("idListMaster2").getBinding("items").refresh(true);
				}.bind(this),
				error: function (oError) {
					this.getView().byId("idTituloOrden").setText("Ordenes de Compra (0)");
					this.getView().byId("master1").setBusy(false);
				}.bind(this)
			});
			}else{

			var varFecha = oModel.getProperty("/listCheck").rFecha;
			var varSituacion = oModel.getProperty("/listCheck").rSituacion;
			var varEstado = oModel.getProperty("/listCheck").rEstado;
			//Filtros
			var filters = [];
			var filter;
			if (varFecha) {
				var res = sap.ui.getCore().byId(this.byId('idSegmentedSelect').getSelectedItem()).getText();
				if (res === "Por Fecha") {
					var varFilFec = this.getView().byId("idFec").getValue();
					filter = new sap.ui.model.Filter("OC_FECHA_EMISION", sap.ui.model.FilterOperator.EQ, varFilFec);
					filters.push(filter);
				} else if (res === "Entre Fechas") {
					var varFilFecIni = this.getView().byId("idFecIni").getValue();
					var varFilFecFin = this.getView().byId("idFecFin").getValue();
					filter = new sap.ui.model.Filter("OC_FECHA_EMISION", sap.ui.model.FilterOperator.BT, varFilFecIni, varFilFecFin);
					filters.push(filter);
				}
			}

			if (varSituacion) {
				var varFilSituacion = this.getView().byId("idSituacion").getValue();
				if (varFilSituacion === "Todo") {
					filter = new sap.ui.model.Filter("OC_SITUACION", sap.ui.model.FilterOperator.Contains, "");
					filters.push(filter);
				} else {
					filter = new sap.ui.model.Filter("OC_SITUACION", sap.ui.model.FilterOperator.EQ, varFilSituacion);
					filters.push(filter);
				}
			}

			if (varEstado) {
				var varFilEstado = this.getView().byId("idEstado").getValue();
				if (varFilEstado === "Todo") {
					filter = new sap.ui.model.Filter("OC_ESTADO", sap.ui.model.FilterOperator.Contains, "");
					filters.push(filter);
				} else {
					filter = new sap.ui.model.Filter("OC_ESTADO", sap.ui.model.FilterOperator.EQ, varFilEstado);
					filters.push(filter);
				}
			}

			// Mostrar JSON
			oModelxd.read("/T_OC?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					for (var i = 0; i < lenghtV; i++) {
						registro = {};
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
					this.getView().byId("master1").setBusy(false);
					this.getView().byId("idTituloOrden").setText("Ordenes de Compra (" + lenghtV + ")");
				}.bind(this),
				error: function (oError) {
					this.getView().byId("idTituloOrden").setText("Ordenes de Compra (0)");
					this.getView().byId("master1").setBusy(false);
				}.bind(this)
			});
			}

			this.getSplitAppObj().toMaster(this.createId("master1"));
		},
		btnRegresarMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master1"));
			this.getView().byId("idTabBarFac").setVisible(false);
			this.getView().byId("ohFac").setVisible(false);
			this.getView().byId("idListMaster3").removeSelections(true);
			this.getView().byId("idListMaster1").removeSelections(true);
		},
		evtCambioCantidad: function (evt) {

			var valor1 = evt.getSource().getValue();
			var valor2 = evt.getSource().getBindingContext("myParam").getObject().clistItemFiltroEntregadoCantidadFac;
			var ingresado = evt.getSource().getBindingContext("myParam").getObject().clistItemFiltroEntregadoValorNeto;
			if (ingresado === "" || ingresado === null || ingresado === undefined) {
				ingresado = "0"
			}
		
			var descuento = evt.getSource().getBindingContext("myParam").getObject().clistItemFiltroEntregadoDescuento;
			if (descuento === "" || descuento === null || descuento === undefined) {
				descuento = "0"
			}
			var limite = parseFloat(ingresado.toString()) - parseFloat(descuento.toString());
			if (valor1 === "" || valor1 === null || valor1 === undefined) {
				evt.getSource().setValue("");
			} else {
				var valor1String = valor1.toString();
				valor1 = parseFloat(valor1.toString());
				limite = parseFloat(limite.toString());
				if (valor1 >= 0 && valor1 <= limite) {
					evt.getSource().setValue(valor1String);
				} else {
					if (valor1 < 0) {
						sap.m.MessageToast.show("No se permiten valores negativos.");
					} else {
						sap.m.MessageToast.show("Valor superior a la cantidad límite.");
					}
					evt.getSource().setValue(valor2.toString());
				}
			}
		},
		pressDocumento:function(oEvent){
				var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("myParam");
			var filename = oContext.getObject().NOMBRE_DOC;
			var uri = "/DOCUMENT/c4def343310ca504ab4c93d5/root/" + filename;
			var link = document.createElement("a");
			link.download = filename;
			link.href = uri;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		evtCambioCantidadA: function (evt) {

			var valor1 = evt.getSource().getValue();
			var valor2 = evt.getSource().getBindingContext("myParam").getObject().clistItemFiltroAceptadoCantidadFac;
			var incluido = valor1.includes(".");
			var mensaje = false;
			if (incluido) {
				valor1 = valor1.split(".");
				valor1 = valor1[0].toString();
				mensaje = true;
			}

			var ingresado = evt.getSource().getBindingContext("myParam").getObject().clistItemFiltroAceptadoCantidad;
			if (ingresado === "" || ingresado === null || ingresado === undefined) {
				ingresado = "0"
			}
			var factura = evt.getSource().getBindingContext("myParam").getObject().clistItemFiltroAceptadoFactura;
			if (factura === "" || factura === null || factura === undefined) {
				factura = "0"
			}
			var descuento = evt.getSource().getBindingContext("myParam").getObject().clistItemFiltroAceptadoDescuento;
			if (descuento === "" || descuento === null || descuento === undefined) {
				descuento = "0"
			}
			var limite = parseInt(ingresado.toString()) - parseInt(factura.toString()) - parseInt(descuento.toString());
			if (valor1 === "" || valor1 === null || valor1 === undefined) {
				evt.getSource().setValue("");
			} else {
				valor1 = parseInt(valor1.toString());
				limite = parseInt(limite.toString());
				if (valor1 >= 0 && valor1 <= limite) {
					evt.getSource().setValue(valor1.toString());
					if (mensaje) {
						sap.m.MessageToast.show("No se permiten valores con decimales.");
					}
				} else {
					if (valor1 < 0) {
						sap.m.MessageToast.show("No se permiten valores negativos.");
					} else {
						sap.m.MessageToast.show("Valor superior a la cantidad límite.");
					}
					evt.getSource().setValue(valor2.toString());
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

			var url = "/odatabnv/odata2.svc/";
			var oModelOData = new sap.ui.model.odata.v2.ODataModel(url, true);

			// Mostrar JSON
			var filters = [];
			var filters2 = [];
			var filter;
			filter = new sap.ui.model.Filter("NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, factura.OC_NUMERO_ORDEN);
			filters.push(filter);
			filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, factura.OC_ID_FACTURA);
			filters.push(filter);
			filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, factura.OC_NUMERO_ORDEN);
			filters2.push(filter);
			filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, factura.OC_ID_FACTURA);
			filters2.push(filter);
			oModelOData.read("/tb_detalle_prev?$format=json", {
				filters: filters2,
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
				}.bind(this)
			});
			oModelOData.read("/tb_documento?$format=json", {
				filters: filters,
				success: function (response) {

					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

					var lenghtV = oModelJSON.getData().length;
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
				}.bind(this)
			});
			this.getView().byId("ohFac").setVisible(true);
			this.getView().byId("idTabBarFac").setVisible(true);

		},
		clicItemOrden: function (oEvent) {

			var oThis = this;
			this.getView().byId("detail1").setBusy(true);
			var oModel = oThis.getView().getModel("myParam");
			var modo = oModel.getProperty("/modoOC");
			if (modo === "ordenCompra") {
				var itemSeleccionado = oEvent.getSource().getSelectedItem();
				var valObject = itemSeleccionado.getBindingContext("myParam").getPath().toString();
				var objeto = itemSeleccionado.getBindingContext("myParam").getObject().cOrdenCompraNum;
				var url = "/odatabnv/odata2.svc/";
				var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
				var filters = [];
				var filter;
				filter = new sap.ui.model.Filter("OC_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, objeto);
				filters.push(filter);

				oModelJson.read("/T_FAC_POS?$format=json", {
					filters: filters,
					success: function (response) {
						var oModelJSON2 = new sap.ui.model.json.JSONModel(response.results);
						var lenghtV2 = oModelJSON2.getData().length;

						// Borrar seleccion checks de las tablas
						var oTableEntregado = this.getView().byId("idTableItemEntregado");
						var idxEntregado = oTableEntregado.indexOfRow(1);
						oTableEntregado.setSelectedIndex(idxEntregado);

						var oTableAceptado = this.getView().byId("idTableItemAceptado");
						var idxAceptado = oTableAceptado.indexOfRow(1);
						oTableAceptado.setSelectedIndex(idxAceptado);

						var llave = this.getView().byId("idIconTabBarSeparatorMixed").getSelectedKey().toString();
							this.getView().byId("idButtonFac").setVisible(true);
						// Selecciona el primer IconBar de los filtros
						var oIconBarEnProcesoPrincipal = this.getView().byId("idIconTabBarSeparatorMixed");
						oIconBarEnProcesoPrincipal.setSelectedKey("EnProceso");

						// Desaparece paneles por defecto al iniciar el proyecto
						var oProductDetail1PanelCabecera = this.getView().byId("oh1");
						oProductDetail1PanelCabecera.setVisible(true);

						var oProductDetail1PanelIconBar = this.getView().byId("idIconTabBarSeparatorMixed");
						oProductDetail1PanelIconBar.setVisible(true);

						// Obtener el ID principal de lo seleccionado

						var ordenCompra = itemSeleccionado.getBindingContext("myParam").getObject();
						this.getView().byId("idTituloProceso").setText("Detalle de la Posición - En Proceso (" + objeto + ")");
						this.getView().byId("idTituloAceptado").setText("Detalle de la Posición - Facturado (" + objeto + ")");
						this.getView().byId("idTituloFacturado").setText("Detalle de la Posición - Finalizado (" + objeto + ")");
						this.getView().byId("idTituloEntregado").setText("Detalle de la Posición - Entregado (" + objeto + ")");
						// Llamar modelo

						var vlistOrdenCompraNum = oModel.getProperty(valObject + "/cOrdenCompraNum");
						var vlistOrdenCompraFecha = oModel.getProperty(valObject + "/cOrdenCompraFechaEmision");
						var vlistOrdenCompraImporte = oModel.getProperty(valObject + "/cOrdenCompraImporte");
						var vlistOrdenCompraMoneda = oModel.getProperty(valObject + "/cOrdenCompraMoneda");
						var vlistOrdenCompraSituacion = oModel.getProperty(valObject + "/cOrdenCompraSituacion");
						var vlistOrdenCompraEstado = oModel.getProperty(valObject + "/cOrdenCompraEstado");
						var vlistOrdenCompraIGV = oModel.getProperty(valObject + "/cOrdenCompraIGV");

						// Registros para el Reporte
						var registroItem = {};

						registroItem.rOrdenCompra = vlistOrdenCompraNum;
						registroItem.rFecha = vlistOrdenCompraFecha;
						registroItem.rImporte = vlistOrdenCompraImporte;
						registroItem.rMoneda = vlistOrdenCompraMoneda;
						registroItem.rSituacion = vlistOrdenCompraSituacion;
						registroItem.rEstado = vlistOrdenCompraEstado;
						registroItem.rIGV = vlistOrdenCompraIGV;

						// Insertar el registro en la tabla listConsultaResumenServicio
						oModel.setProperty("/listConsultaResumenOrden", registroItem);
						oModel.setProperty("/ordenCompraCabecera", ordenCompra);
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

						var matrixEnProceso = [];
						var matrixAceptado = [];
						var matrixFacturado = [];
						var matrixEntregado = [];
						var matrixPendiente = [];

						var registroEnProceso = {};
						var registroAceptado = {};
						var registroFacturado = {};
						var registroEntregado = {};
						var registroPendiente = {};

						var oView = oThis.getView();

						//Filtros
						var filterOrdenCompra = [];
						var filter;
						filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, vlistOrdenCompraNum);
						filterOrdenCompra.push(filter);

						// Mostrar JSON


						var contEnProceso = 0;
						var contPendiente = 0;
						var contAceptado = 0;
						var contFacturado = 0;
						var contEntregado = 0;

						oModelJson.read("/T_OC_DET?$format=json", {
							filters: filterOrdenCompra,
							success: function (response) {
								try {
									var oModelJSON = new sap.ui.model.json.JSONModel(response.results);

									var tamTabla = oModelJSON.getData().length;
									var varSumaEntregaIGV = 0;
									var varSumaEntregaValorNeto = 0;
									var varSumaAceptadoIGV = 0;
									var varSumaAceptadoValorNeto = 0;
									var cantidadDesc = 0;
									for (var i = 0; i < tamTabla; i++) {
										cantidadDesc = 0;
										for (var m = 0; m < lenghtV2; m++) {
											if (oModelJSON.getData()[i].DE_POSICION.toString() === oModelJSON2.getData()[m].DE_POSICION.toString()) {
												cantidadDesc = cantidadDesc + parseFloat(oModelJSON2.getData()[m].PRECIO_ING.toString());
											}
										}
										var varEstado1 = oModelJSON.getData()[i].DE_SITUACION1;
										var varEstado2 = oModelJSON.getData()[i].DE_SITUACION2;

										if (varEstado1 === "En Proceso" || varEstado1 === "Aceptado" || varEstado1 === "Entregado" || varEstado1 ===
											"Pendiente") {
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
											contEnProceso++;
										}
										if (varEstado1 === "Pendiente") {

											registroPendiente = {};
											registroPendiente.clistItemFiltroPendienteDescripcion = oModelJSON.getData()[i].DE_DESCRIPCION;
											registroPendiente.clistItemFiltroPendienteCantidad = oModelJSON.getData()[i].DE_CANTIDAD;
											registroPendiente.clistItemFiltroPendienteFactura = oModelJSON.getData()[i].DE_FACTURA;
											registroPendiente.clistItemFiltroPendienteDescuento = cantidadDesc;
											registroPendiente.clistItemFiltroPendienteCantidadFac = "0";
											registroPendiente.clistItemFiltroPendientePrecio = oModelJSON.getData()[i].DE_PRECIO;
											registroPendiente.clistItemFiltroPendienteValorNeto = oModelJSON.getData()[i].DE_TOTAL;
											registroPendiente.clistItemFiltroPendienteEstado = oModelJSON.getData()[i].DE_SITUACION1;
											registroPendiente.clistItemFiltroPendienteMoneda = oModelJSON.getData()[i].DE_MONEDA;
											registroPendiente.clistItemFiltroPendienteGuiaRemision = oModelJSON.getData()[i].DE_GUIA_REMISION;
											registroPendiente.clistItemFiltroPendienteDireccionEntrega = oModelJSON.getData()[i].DE_DIRECCION;
											registroPendiente.clistItemFiltroPendienteNumDocMaterial = oModelJSON.getData()[i].DE_DOC_MATERIAL;
											registroPendiente.clistItemFiltroPendienteNumMaterial = oModelJSON.getData()[i].DE_NUM_MATERIAL;
											registroPendiente.clistItemFiltroPendienteIdCrono = oModelJSON.getData()[i].DE_NUM_ARTICULO;
											registroPendiente.clistItemFiltroPendienteBUKRS = oModelJSON.getData()[i].DE_COD_EMPRESA;
											registroPendiente.clistItemFiltroPendienteOrdenCompra = oModelJSON.getData()[i].DE_NUMERO_ORDEN;
											registroPendiente.clistItemFiltroPendienteAno = oModelJSON.getData()[i].DE_ANO;
											registroPendiente.clistItemFiltroPendientePosicion = oModelJSON.getData()[i].DE_POSICION;
											registroPendiente.clistItemFiltroPendienteFechaRegistro = oModelJSON.getData()[i].DE_FEC_REGISTRO;
											varSumaEntregaValorNeto = varSumaEntregaValorNeto + parseFloat(oModelJSON.getData()[i].DE_TOTAL, 10);
											varSumaEntregaIGV = varSumaEntregaIGV + parseFloat(oModelJSON.getData()[i].DE_IGV, 10);
											matrixPendiente.push(registroPendiente);
											contPendiente++;
										}

										if (varEstado1 === "Entregado") {
											registroEntregado = {};
											registroEntregado.clistItemFiltroEntregadoDescripcion = oModelJSON.getData()[i].DE_DESCRIPCION;
											registroEntregado.clistItemFiltroEntregadoCantidad = oModelJSON.getData()[i].DE_CANTIDAD;
											registroEntregado.clistItemFiltroEntregadoFactura = oModelJSON.getData()[i].DE_FACTURA;
											registroEntregado.clistItemFiltroEntregadoDescuento = cantidadDesc;
											registroEntregado.clistItemFiltroEntregadoCantidadFac = "0";
											registroEntregado.clistItemFiltroEntregadoPrecio = oModelJSON.getData()[i].DE_PRECIO;
											registroEntregado.clistItemFiltroEntregadoValorNeto = oModelJSON.getData()[i].DE_TOTAL;
											registroEntregado.clistItemFiltroEntregadoEstado = oModelJSON.getData()[i].DE_SITUACION1;
											registroEntregado.clistItemFiltroEntregadoMoneda = oModelJSON.getData()[i].DE_MONEDA;
											registroEntregado.clistItemFiltroEntregadoGuiaRemision = oModelJSON.getData()[i].DE_GUIA_REMISION;
											registroEntregado.clistItemFiltroEntregadoDireccionEntrega = oModelJSON.getData()[i].DE_DIRECCION;
											registroEntregado.clistItemFiltroEntregadoNumDocMaterial = oModelJSON.getData()[i].DE_DOC_MATERIAL;
											registroEntregado.clistItemFiltroEntregadoNumMaterial = oModelJSON.getData()[i].DE_NUM_MATERIAL;
											registroEntregado.clistItemFiltroEntregadoIdCrono = oModelJSON.getData()[i].DE_NUM_ARTICULO;
											registroEntregado.clistItemFiltroEntregadoBUKRS = oModelJSON.getData()[i].DE_COD_EMPRESA;
											registroEntregado.clistItemFiltroEntregadoOrdenCompra = oModelJSON.getData()[i].DE_NUMERO_ORDEN;
											registroEntregado.clistItemFiltroEntregadoAno = oModelJSON.getData()[i].DE_ANO;
											registroEntregado.clistItemFiltroEntregadoPosicion = oModelJSON.getData()[i].DE_POSICION;
											registroEntregado.clistItemFiltroEntregadoFechaRegistro = oModelJSON.getData()[i].DE_FEC_REGISTRO;
											varSumaEntregaValorNeto = varSumaEntregaValorNeto + parseFloat(oModelJSON.getData()[i].DE_TOTAL, 10);
											varSumaEntregaIGV = varSumaEntregaIGV + parseFloat(oModelJSON.getData()[i].DE_IGV, 10);
											matrixEntregado.push(registroEntregado);
											contEntregado++;
										}

										if (varEstado1 === "Aceptado") {
											registroAceptado = {};
											registroAceptado.clistItemFiltroAceptadoDescripcion = oModelJSON.getData()[i].DE_DESCRIPCION;
											registroAceptado.clistItemFiltroAceptadoCantidad = oModelJSON.getData()[i].DE_CANTIDAD;
											registroAceptado.clistItemFiltroAceptadoFactura = oModelJSON.getData()[i].DE_FACTURA;
											registroAceptado.clistItemFiltroAceptadoDescuento = cantidadDesc;
											registroAceptado.clistItemFiltroAceptadoCantidadFac = "0";
											registroAceptado.clistItemFiltroAceptadoPrecio = oModelJSON.getData()[i].DE_PRECIO;
											registroAceptado.clistItemFiltroAceptadoValorNeto = oModelJSON.getData()[i].DE_TOTAL;
											registroAceptado.clistItemFiltroAceptadoEstado = oModelJSON.getData()[i].DE_SITUACION1;
											registroAceptado.clistItemFiltroAceptadoMoneda = oModelJSON.getData()[i].DE_MONEDA;
											registroAceptado.clistItemFiltroAceptadoDireccionEntrega = oModelJSON.getData()[i].DE_DIRECCION;
											registroAceptado.clistItemFiltroAceptadoServicio = oModelJSON.getData()[i].DE_NUM_SERVICIO;
											registroAceptado.clistItemFiltroAceptadoNumDocMaterial = oModelJSON.getData()[i].DE_DOC_MATERIAL;
											registroAceptado.clistItemFiltroAceptadoNumAceptacion = oModelJSON.getData()[i].DE_NUM_ACEPTACION;
											registroAceptado.clistItemFiltroAceptadoHojaEntrada = oModelJSON.getData()[i].DE_HOJA_ENTRADA;
											registroAceptado.clistItemFiltroAceptadoIdCrono = oModelJSON.getData()[i].DE_NUM_ARTICULO;
											registroAceptado.clistItemFiltroAceptadoBUKRS = oModelJSON.getData()[i].DE_COD_EMPRESA;
											registroAceptado.clistItemFiltroAceptadoOrdenCompra = oModelJSON.getData()[i].DE_NUMERO_ORDEN;
											registroAceptado.clistItemFiltroAceptadoAno = oModelJSON.getData()[i].DE_ANO;
											registroAceptado.clistItemFiltroAceptadoPosicion = oModelJSON.getData()[i].DE_POSICION;
											registroAceptado.clistItemFiltroAceptadoFechaAceptacion = oModelJSON.getData()[i].DE_FEC_ACEPTACION;
											varSumaAceptadoValorNeto = varSumaAceptadoValorNeto + parseFloat(oModelJSON.getData()[i].DE_TOTAL, 10);
											varSumaAceptadoIGV = varSumaAceptadoIGV + parseFloat(oModelJSON.getData()[i].DE_IGV, 10);
											matrixAceptado.push(registroAceptado);
											contAceptado++;
										}

										if (varEstado2 === "Facturado") {
											registroFacturado = {};
											registroFacturado.clistItemFiltroFacturadoDescripcion = oModelJSON.getData()[i].DE_DESCRIPCION;
											registroFacturado.clistItemFiltroFacturadoCantidad = oModelJSON.getData()[i].DE_CANTIDAD;
											registroFacturado.clistItemFiltroFacturadoPrecio = oModelJSON.getData()[i].DE_PRECIO;
											registroFacturado.clistItemFiltroFacturadoValorNeto = oModelJSON.getData()[i].DE_TOTAL;
											registroFacturado.clistItemFiltroFacturadoEstado = oModelJSON.getData()[i].DE_SITUACION2;
											registroFacturado.clistItemFiltroFacturadoMoneda = oModelJSON.getData()[i].DE_MONEDA;
											registroFacturado.clistItemFiltroFacturadoDireccionEntrega = oModelJSON.getData()[i].DE_DIRECCION;
											registroFacturado.clistItemFiltroFacturadoServicio = oModelJSON.getData()[i].DE_NUM_SERVICIO;
											registroFacturado.clistItemFiltroFacturadoNumDocSap = oModelJSON.getData()[i].DE_NUM_DOC_SAP;
											registroFacturado.clistItemFiltroFacturadoNumFacturaSunat = oModelJSON.getData()[i].DE_NUM_FACTURA;
											registroFacturado.clistItemFiltroFacturadoIdCrono = oModelJSON.getData()[i].DE_NUM_ARTICULO;
											matrixFacturado.push(registroFacturado);
											contFacturado++;
										}
									}
									// Visibilidad IconBar
									var oIconBarEntregado = this.getView().byId("idIconBarEntregado");
									var oIconBarAceptado = this.getView().byId("idIconBarAceptado");
									var oSeparadorVertical = this.getView().byId("idSeparadorVertical");
									var oSeparadorDerecha = this.getView().byId("idSeparadorDerecha");

									/*		if (contEntregado === 0) {
												oIconBarEntregado.setVisible(false);
											} else {
												oIconBarEntregado.setVisible(true);
											}

											if (contAceptado === 0) {
												oIconBarAceptado.setVisible(false);
											} else {
												oIconBarAceptado.setVisible(true);
											}

											if ((contEntregado !== 0 && contAceptado !== 0) || contEntregado !== 0 || contAceptado !== 0) {
												oSeparadorDerecha.setVisible(true);
											} else {
												oSeparadorDerecha.setVisible(false);
											}

											if (contEntregado !== 0 && contAceptado !== 0) {
												oSeparadorVertical.setVisible(true);
											} else {
												oSeparadorVertical.setVisible(false);
											}*/

									// Insertar y Actualizar tabla En Proceso
									oModel.setProperty("/listItemFiltroEnProceso", matrixEnProceso);
									oThis.getView().byId("idTableItemEnProceso").getBinding("rows").refresh(true);

									// Numero de Registros para la tabla En Proceso
									var registroTotalItemEnProceso = {};
									registroTotalItemEnProceso.rCampoEnProceso = contEnProceso;
									oModel.setProperty("/listTotalItemEnProceso", registroTotalItemEnProceso);

									// Insertar y Actualizar tabla Pendiente
									oModel.setProperty("/listItemFiltroPendiente", matrixPendiente);
									oThis.getView().byId("idTableItemPendiente").getBinding("rows").refresh(true);

									// Numero de Registros para la tabla Pendiente
									var registroTotalItemPendiente = {};
									registroTotalItemPendiente.rCampoPendiente = contPendiente;
									oModel.setProperty("/listTotalItemPendiente", registroTotalItemPendiente);

									// Insertar y Actualizar tabla Entregado
									oModel.setProperty("/listItemFiltroEntregado", matrixEntregado);
									oThis.getView().byId("idTableItemEntregado").getBinding("rows").refresh(true);

									// Numero de Registros para la tabla Entregado
									var registroTotalItemEntregado = {};
									registroTotalItemEntregado.rCampoEntregado = contEntregado;
									oModel.setProperty("/listTotalItemEntregado", registroTotalItemEntregado);

									// Insertar y Actualizar tabla Aceptacion
									oModel.setProperty("/listItemFiltroAceptado", matrixAceptado);
									oThis.getView().byId("idTableItemAceptado").getBinding("rows").refresh(true);

									// Numero de Registros para la tabla Aceptado
									var registroTotalItemAceptado = {};
									registroTotalItemAceptado.rCampoAceptado = contAceptado;
									oModel.setProperty("/listTotalItemAceptado", registroTotalItemAceptado);

									// Insertar y Actualizar tabla Facturado
									oModel.setProperty("/listItemFiltroFacturado", matrixFacturado);
									oThis.getView().byId("idTableItemFacturado").getBinding("rows").refresh(true);

									// Numero de Registros para la tabla Facturado
									var registroTotalItemFacturado = {};
									registroTotalItemFacturado.rCampoFacturado = contFacturado;
									oModel.setProperty("/listTotalItemFacturado", registroTotalItemFacturado);
									this.getView().byId("detail1").setBusy(false);
								} catch (err) {
									this.getView().byId("detail1").setBusy(false);
								}

							}.bind(this),
							error: function (oError) {
								this.getView().byId("detail1").setBusy(false);
							}.bind(this)
						});

						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

						this.getSplitAppObj().to(this.createId("detail1"));
					}.bind(this),
					error: function (oError) {
						this.getView().byId("detail1").setBusy(false);
						var dialog = new sap.m.Dialog({
							title: "Error",
							type: "Message",
							state: "Error",
							icon: "sap-icon://error",
							content: new sap.m.Text({
								text: "Se ha presentado un error a la hora de obtener la O/C."
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
			} else {
				this.getView().byId("detail1").setBusy(false);
				this.inicioListaFacturaOrdenesCompra(oEvent);
			}

		},
		formatoCalculoDisponible: function (valor1, valor2) {
			if (valor1 === "" || valor1 === null || valor1 === undefined) {
				valor1 = "0";
			}
			if (valor2 === "" || valor2 === null || valor2 === undefined) {
				valor2 = "0";
			}
			valor1 = parseFloat(valor1);
			valor2 = parseFloat(valor2);
			var calculo = valor1 - valor2;
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});

			return oNumberFormat.format(calculo);
		},
		btnVolverDetail1: function () {

			this.getSplitAppObj().to(this.createId("detail1"));
		},
		clicItemEnPendiente: function (oEvent) {
			this.getView().setBusy(true);
			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");

			// Obtener el ID principal de lo seleccionado

			var valObject = oContext.getPath();
			var vlistItemFiltroEnProcesoDescripcion = oModel.getProperty(valObject + "/clistItemFiltroPendienteDescripcion");
			var vlistItemFiltroEnProcesoValorNeto = oModel.getProperty(valObject + "/clistItemFiltroPendienteValorNeto");
			var vlistItemFiltroEnProcesoMoneda = oModel.getProperty(valObject + "/clistItemFiltroPendienteMoneda");
			var vlistItemFiltroEnProcesoCantidad = oModel.getProperty(valObject + "/clistItemFiltroPendienteCantidad");
			var vlistItemFiltroEnProcesoEstado = oModel.getProperty(valObject + "/clistItemFiltroPendienteEstado");
			var vlistItemFiltroEnProcesoNumMaterial = oModel.getProperty(valObject + "/clistItemFiltroPendienteNumMaterial");
			var vlistItemFiltroEnProcesoDireccionEntrega = oModel.getProperty(valObject + "/clistItemFiltroPendienteDireccionEntrega");
			var vlistItemFiltroEnProcesoIdCrono = parseInt(oModel.getProperty(valObject + "/clistItemFiltroPendienteIdCrono"), 10);
			var clistItemFiltroEnProcesoPrecio = oModel.getProperty(valObject + "/clistItemFiltroPendientePrecio");

			// Registros para el Reporte
			var registroItem = {};

			registroItem.rDescripcion = vlistItemFiltroEnProcesoDescripcion;
			registroItem.rValorNeto = Intl.NumberFormat("de-DE").format(vlistItemFiltroEnProcesoValorNeto);
			registroItem.rMoneda = vlistItemFiltroEnProcesoMoneda;
			registroItem.rCantidad = vlistItemFiltroEnProcesoCantidad;
			registroItem.rEstado = vlistItemFiltroEnProcesoEstado;
			registroItem.rNumMaterial = vlistItemFiltroEnProcesoNumMaterial;
			registroItem.rDireccionEntrega = vlistItemFiltroEnProcesoDireccionEntrega;
			registroItem.clistItemFiltroEnProcesoPrecio = clistItemFiltroEnProcesoPrecio;

			// Insertar el registro en la tabla listConsultaResumenEnProceso
			oModel.setProperty("/listConsultaResumenEnProceso", registroItem);

			// Tabla Cronograma =================================================
			var oModelDetalleFiltro = oModel.getProperty("/listConsultaResumenOrden/rOrdenCompra");

			//Filtros
			var filters = [];
			var filter1 = new sap.ui.model.Filter("CR_NUM_ORDEN", sap.ui.model.FilterOperator.EQ, oModelDetalleFiltro);
			filters.push(filter1);
			var filter2 = new sap.ui.model.Filter("CR_NUM_ARTICULO", sap.ui.model.FilterOperator.EQ, vlistItemFiltroEnProcesoIdCrono);
			filters.push(filter2);

			// Mostrar JSON
			var url = "/odatabnv/odata2.svc/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrixCronoEnProceso = [];
			var registroCronoEnProceso = {};
			oModelJson.read("/T_CRONOGRAMA?$format=json", {
				filters: filters,
				success: function (response) {
					try {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						var contCronoEnProceso = 0;
						for (var i = 0; i < tamTabla; i++) {
							registroCronoEnProceso = {};
							registroCronoEnProceso.clistItemCronogramaEnProcesoCantidad = oModelJSON.getData()[i].CR_CANTIDAD;
							registroCronoEnProceso.clistItemCronogramaEnProcesoFechaEntrega = oModelJSON.getData()[i].CR_FEC_ENTREGA;
							registroCronoEnProceso.clistItemCronogramaEnProcesoFechaEstimada = oModelJSON.getData()[i].CR_FEC_ESTIMADA;
							registroCronoEnProceso.clistItemCronogramaEnProcesoEstado = oModelJSON.getData()[i].CR_SITUACION1;
							matrixCronoEnProceso.push(registroCronoEnProceso);
							contCronoEnProceso++;
						}

						// Insertar y Actualizar tabla Cronograma En Proceso
						oModel.setProperty("/listItemCronogramaEnProceso", matrixCronoEnProceso);
						oThis.getView().byId("idTableItemCronogramaPendiente").getBinding("rows").refresh(true);

						// Numero de Registros para la Tabla Cronograma - En Proceso
						var registroTotalItemCronogramaEnProceso = {};
						registroTotalItemCronogramaEnProceso.rCampoCronogramaEnProceso = contCronoEnProceso;
						oModel.setProperty("/listTotalItemCronogramaEnProceso", registroTotalItemCronogramaEnProceso);
						this.getView().setBusy(false);
					} catch (err) {
						this.getView().setBusy(false);
					}

				}.bind(this),

				error: function (oError) {
					this.getView().setBusy(false);
				}.bind(this)
			});

			this.getSplitAppObj().to(this.createId("detail33"));
		},
		clicItemEnProceso: function (oEvent) {
			this.getView().setBusy(true);
			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");

			// Obtener el ID principal de lo seleccionado
			var valObject = oContext.getPath();
			var vlistItemFiltroEnProcesoDescripcion = oModel.getProperty(valObject + "/clistItemFiltroEnProcesoDescripcion");
			var vlistItemFiltroEnProcesoValorNeto = oModel.getProperty(valObject + "/clistItemFiltroEnProcesoValorNeto");
			var vlistItemFiltroEnProcesoMoneda = oModel.getProperty(valObject + "/clistItemFiltroEnProcesoMoneda");
			var vlistItemFiltroEnProcesoCantidad = oModel.getProperty(valObject + "/clistItemFiltroEnProcesoCantidad");
			var vlistItemFiltroEnProcesoEstado = oModel.getProperty(valObject + "/clistItemFiltroEnProcesoEstado");
			var vlistItemFiltroEnProcesoNumMaterial = oModel.getProperty(valObject + "/clistItemFiltroEnProcesoNumMaterial");
			var vlistItemFiltroEnProcesoDireccionEntrega = oModel.getProperty(valObject + "/clistItemFiltroEnProcesoDireccionEntrega");
			var vlistItemFiltroEnProcesoIdCrono = parseInt(oModel.getProperty(valObject + "/clistItemFiltroEnProcesoIdCrono"), 10);
			var clistItemFiltroEnProcesoPrecio = oModel.getProperty(valObject + "/clistItemFiltroEnProcesoPrecio");

			// Registros para el Reporte
			var registroItem = {};

			registroItem.rDescripcion = vlistItemFiltroEnProcesoDescripcion;
			registroItem.rValorNeto = Intl.NumberFormat("de-DE").format(vlistItemFiltroEnProcesoValorNeto);
			registroItem.rMoneda = vlistItemFiltroEnProcesoMoneda;
			registroItem.rCantidad = vlistItemFiltroEnProcesoCantidad;
			registroItem.rEstado = vlistItemFiltroEnProcesoEstado;
			registroItem.rNumMaterial = vlistItemFiltroEnProcesoNumMaterial;
			registroItem.rDireccionEntrega = vlistItemFiltroEnProcesoDireccionEntrega;
			registroItem.clistItemFiltroEnProcesoPrecio = clistItemFiltroEnProcesoPrecio;

			// Insertar el registro en la tabla listConsultaResumenEnProceso
			oModel.setProperty("/listConsultaResumenEnProceso", registroItem);

			// Tabla Cronograma =================================================
			var oModelDetalleFiltro = oModel.getProperty("/listConsultaResumenOrden/rOrdenCompra");

			//Filtros
			var filters = [];
			var filter1 = new sap.ui.model.Filter("CR_NUM_ORDEN", sap.ui.model.FilterOperator.EQ, oModelDetalleFiltro);
			filters.push(filter1);
			var filter2 = new sap.ui.model.Filter("CR_NUM_ARTICULO", sap.ui.model.FilterOperator.EQ, vlistItemFiltroEnProcesoIdCrono);
			filters.push(filter2);

			// Mostrar JSON
			var url = "/odatabnv/odata2.svc/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrixCronoEnProceso = [];
			var registroCronoEnProceso = {};
			oModelJson.read("/T_CRONOGRAMA?$format=json", {
				filters: filters,
				success: function (response) {
					try {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						var contCronoEnProceso = 0;
						for (var i = 0; i < tamTabla; i++) {
							registroCronoEnProceso = {};
							registroCronoEnProceso.clistItemCronogramaEnProcesoCantidad = oModelJSON.getData()[i].CR_CANTIDAD;
							registroCronoEnProceso.clistItemCronogramaEnProcesoFechaEntrega = oModelJSON.getData()[i].CR_FEC_ENTREGA;
							registroCronoEnProceso.clistItemCronogramaEnProcesoFechaEstimada = oModelJSON.getData()[i].CR_FEC_ESTIMADA;
							registroCronoEnProceso.clistItemCronogramaEnProcesoEstado = oModelJSON.getData()[i].CR_SITUACION1;
							matrixCronoEnProceso.push(registroCronoEnProceso);
							contCronoEnProceso++;
						}

						// Insertar y Actualizar tabla Cronograma En Proceso
						oModel.setProperty("/listItemCronogramaEnProceso", matrixCronoEnProceso);
						oThis.getView().byId("idTableItemCronogramaEnProceso").getBinding("rows").refresh(true);

						// Numero de Registros para la Tabla Cronograma - En Proceso
						var registroTotalItemCronogramaEnProceso = {};
						registroTotalItemCronogramaEnProceso.rCampoCronogramaEnProceso = contCronoEnProceso;
						oModel.setProperty("/listTotalItemCronogramaEnProceso", registroTotalItemCronogramaEnProceso);
						this.getView().setBusy(false);
					} catch (err) {
						this.getView().setBusy(false);
					}

				}.bind(this),

				error: function (oError) {
					this.getView().setBusy(false);
				}.bind(this)
			});

			this.getSplitAppObj().to(this.createId("detail3"));
		},

		clicItemEntregado: function (oEvent) {

			this.getView().setBusy(true);

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");

			// Obtener el ID principal de lo seleccionado
			var valObject = oContext.getPath();
			var vlistItemFiltroEntregadoDescripcion = oModel.getProperty(valObject + "/clistItemFiltroEntregadoDescripcion");
			var vlistItemFiltroEntregadoValorNeto = oModel.getProperty(valObject + "/clistItemFiltroEntregadoValorNeto");
			var vlistItemFiltroEntregadoMoneda = oModel.getProperty(valObject + "/clistItemFiltroEntregadoMoneda");
			var vlistItemFiltroEntregadoCantidad = oModel.getProperty(valObject + "/clistItemFiltroEntregadoCantidad");
			var vlistItemFiltroEntregadoEstado = oModel.getProperty(valObject + "/clistItemFiltroEntregadoEstado");
			var vlistItemFiltroEntregadoNumMaterial = oModel.getProperty(valObject + "/clistItemFiltroEntregadoNumMaterial");
			var vlistItemFiltroEntregadoNumDocMaterial = oModel.getProperty(valObject + "/clistItemFiltroEntregadoNumDocMaterial");
			var vlistItemFiltroEntregadoGuiaRemision = oModel.getProperty(valObject + "/clistItemFiltroEntregadoGuiaRemision");
			var vlistItemFiltroEntregadoDireccionEntrega = oModel.getProperty(valObject + "/clistItemFiltroEntregadoDireccionEntrega");
			var vlistItemFiltroEntregadoFechaRegistro = oModel.getProperty(valObject + "/clistItemFiltroEntregadoFechaRegistro");
			var vlistItemFiltroEntregadoIdCrono = parseInt(oModel.getProperty(valObject + "/clistItemFiltroEntregadoIdCrono"), 10);
			var clistItemFiltroEntregadoPrecio = oModel.getProperty(valObject + "/clistItemFiltroEntregadoPrecio");

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
			registroItem.clistItemFiltroEntregadoPrecio = clistItemFiltroEntregadoPrecio;

			// Insertar el registro en la tabla listConsultaResumenEntregado
			oModel.setProperty("/listConsultaResumenEntregado", registroItem);

			// Tabla Cronograma =================================================
			var oModelDetalleFiltro = oModel.getProperty("/listConsultaResumenOrden/rOrdenCompra");

			//Filtros
			var filters = [];
			var filter1 = new sap.ui.model.Filter("CR_NUM_ORDEN", sap.ui.model.FilterOperator.EQ, oModelDetalleFiltro);
			filters.push(filter1);
			var filter2 = new sap.ui.model.Filter("CR_NUM_ARTICULO", sap.ui.model.FilterOperator.EQ, vlistItemFiltroEntregadoIdCrono);
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

						// Insertar y Actualizar tabla Cronograma Entregado
						oModel.setProperty("/listItemCronogramaEntregado", matrixCronoEntregado);
						oThis.getView().byId("idTableItemCronogramaEntregado").getBinding("rows").refresh(true);

						// Numero de Registros para la Tabla Cronograma - Entregado
						var registroTotalItemCronogramaEntregado = {};
						registroTotalItemCronogramaEntregado.rCampoCronogramaEntregado = contCronoEntregado;
						oModel.setProperty("/listTotalItemCronogramaEntregado", registroTotalItemCronogramaEntregado);
						this.getView().setBusy(false);
					} catch (err) {
						this.getView().setBusy(false);
					}

				}.bind(this),

				error: function (oError) {
					this.getView().setBusy(false);
				}.bind(this)
			});

			this.getSplitAppObj().to(this.createId("detail4"));
		},

		clicItemAceptado: function (oEvent) {

			this.getView().setBusy(true);

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");

			// Obtener el ID principal de lo seleccionado
			var valObject = oContext.getPath();
			var vlistItemFiltroAceptadoDescripcion = oModel.getProperty(valObject + "/clistItemFiltroAceptadoDescripcion");
			var vlistItemFiltroAceptadoValorNeto = oModel.getProperty(valObject + "/clistItemFiltroAceptadoValorNeto");
			var vlistItemFiltroAceptadoMoneda = oModel.getProperty(valObject + "/clistItemFiltroAceptadoMoneda");
			var vlistItemFiltroAceptadoCantidad = oModel.getProperty(valObject + "/clistItemFiltroAceptadoCantidad");
			var vlistItemFiltroAceptadoEstado = oModel.getProperty(valObject + "/clistItemFiltroAceptadoEstado");
			var vlistItemFiltroAceptadoServicio = oModel.getProperty(valObject + "/clistItemFiltroAceptadoServicio");
			var vlistItemFiltroAceptadoNumAceptacion = oModel.getProperty(valObject + "/clistItemFiltroAceptadoNumAceptacion");
			var vlistItemFiltroAceptadoNumDocMaterial = oModel.getProperty(valObject + "/clistItemFiltroAceptadoNumDocMaterial");
			var vlistItemFiltroAceptadoDireccionEntrega = oModel.getProperty(valObject + "/clistItemFiltroAceptadoDireccionEntrega");
			var vlistItemFiltroAceptadoIdCrono = parseInt(oModel.getProperty(valObject + "/clistItemFiltroAceptadoIdCrono"), 10);
			var vlistItemFiltroAceptadoFechaAceptacion = oModel.getProperty(valObject + "/clistItemFiltroAceptadoFechaAceptacion");
			var clistItemFiltroAceptadoPrecio = oModel.getProperty(valObject + "/clistItemFiltroAceptadoPrecio");
			var clistItemFiltroAceptadoHojaEntrada = oModel.getProperty(valObject + "/clistItemFiltroAceptadoHojaEntrada");

			// Registros para el Reporte
			var registroItem = {};

			registroItem.rDescripcion = vlistItemFiltroAceptadoDescripcion;
			registroItem.rValorNeto = Intl.NumberFormat("de-DE").format(vlistItemFiltroAceptadoValorNeto);
			registroItem.rMoneda = vlistItemFiltroAceptadoMoneda;
			registroItem.rCantidad = vlistItemFiltroAceptadoCantidad;
			registroItem.rEstado = vlistItemFiltroAceptadoEstado;
			registroItem.rServicio = vlistItemFiltroAceptadoServicio;
			registroItem.rNumAceptacion = vlistItemFiltroAceptadoNumAceptacion;
			registroItem.rDocMaterial = vlistItemFiltroAceptadoNumDocMaterial;
			registroItem.rDireccionEntrega = vlistItemFiltroAceptadoDireccionEntrega;
			registroItem.rFechaAceptacion = vlistItemFiltroAceptadoFechaAceptacion;
			registroItem.clistItemFiltroAceptadoPrecio = clistItemFiltroAceptadoPrecio;
			registroItem.clistItemFiltroAceptadoHojaEntrada = clistItemFiltroAceptadoHojaEntrada;

			// Insertar el registro en la tabla listConsultaResumenAceptado
			oModel.setProperty("/listConsultaResumenAceptado", registroItem);

			// Tabla Cronograma =================================================
			var oModelDetalleFiltro = oModel.getProperty("/listConsultaResumenOrden/rOrdenCompra");

			//Filtros
			var filters = [];
			var filter1 = new sap.ui.model.Filter("CR_NUM_ORDEN", sap.ui.model.FilterOperator.EQ, oModelDetalleFiltro);
			filters.push(filter1);
			var filter2 = new sap.ui.model.Filter("CR_NUM_ARTICULO", sap.ui.model.FilterOperator.EQ, vlistItemFiltroAceptadoIdCrono);
			filters.push(filter2);

			// Mostrar JSON
			var url = "/odatabnv/odata2.svc/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrixCronoAceptado = [];
			var registroCronoAceptado = {};
			oModelJson.read("/T_CRONOGRAMA?$format=json", {
				filters: filters,
				success: function (response) {
					try {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						var contCronoAceptado = 0;
						for (var i = 0; i < tamTabla; i++) {
							registroCronoAceptado = {};
							registroCronoAceptado.clistItemCronogramaAceptadoCantidad = oModelJSON.getData()[i].CR_CANTIDAD;
							registroCronoAceptado.clistItemCronogramaAceptadoFechaEntrega = oModelJSON.getData()[i].CR_FEC_ENTREGA;
							registroCronoAceptado.clistItemCronogramaAceptadoFechaEstimada = oModelJSON.getData()[i].CR_FEC_ESTIMADA;
							registroCronoAceptado.clistItemCronogramaAceptadoEstado = oModelJSON.getData()[i].CR_SITUACION1;
							matrixCronoAceptado.push(registroCronoAceptado);
							contCronoAceptado++;
						}

						// Insertar y Actualizar tabla Cronograma Aceptado
						oModel.setProperty("/listItemCronogramaAceptado", matrixCronoAceptado);
						oThis.getView().byId("idTableItemCronogramaAceptado").getBinding("rows").refresh(true);

						// Numero de Registros para la Tabla Cronograma - Aceptado
						var registroTotalItemCronogramaAceptado = {};
						registroTotalItemCronogramaAceptado.rCampoCronogramaAceptado = contCronoAceptado;
						oModel.setProperty("/listTotalItemCronogramaAceptado", registroTotalItemCronogramaAceptado);
						this.getView().setBusy(false);
					} catch (err) {
						this.getView().setBusy(false);
					}

				}.bind(this),

				error: function (oError) {
					this.getView().setBusy(false);
				}.bind(this)
			});

			this.getSplitAppObj().to(this.createId("detail5"));
		},

		clicItemFacturado: function (oEvent) {

			this.getView().setBusy(true);

			// Llamar modelo
			var oThis = this;
			var oModel = oThis.getView().getModel("myParam");

			// Obtener los datos del Item selecconados
			var oItem = oEvent.getSource();
			var oContext = oItem.getBindingContext("myParam");

			// Obtener el ID principal de lo seleccionado
			var valObject = oContext.getPath();
			var vlistItemFiltroFacturadoDescripcion = oModel.getProperty(valObject + "/clistItemFiltroFacturadoDescripcion");
			var vlistItemFiltroFacturadoValorNeto = oModel.getProperty(valObject + "/clistItemFiltroFacturadoValorNeto");
			var vlistItemFiltroFacturadoMoneda = oModel.getProperty(valObject + "/clistItemFiltroFacturadoMoneda");
			var vlistItemFiltroFacturadoCantidad = oModel.getProperty(valObject + "/clistItemFiltroFacturadoCantidad");
			var vlistItemFiltroFacturadoEstado = oModel.getProperty(valObject + "/clistItemFiltroFacturadoEstado");
			var vlistItemFiltroFacturadoServicio = oModel.getProperty(valObject + "/clistItemFiltroFacturadoServicio");
			var vlistItemFiltroFacturadoNumFacturaSunat = oModel.getProperty(valObject + "/clistItemFiltroFacturadoNumFacturaSunat");
			var vlistItemFiltroFacturadoNumDocSap = oModel.getProperty(valObject + "/clistItemFiltroFacturadoNumDocSap");
			var vlistItemFiltroFacturadoDireccionEntrega = oModel.getProperty(valObject + "/clistItemFiltroFacturadoDireccionEntrega");
			var vlistItemFiltroFacturadoIdCrono = parseInt(oModel.getProperty(valObject + "/clistItemFiltroFacturadoIdCrono"), 10);
			var clistItemFiltroFacturadoPrecio = oModel.getProperty(valObject + "/clistItemFiltroFacturadoPrecio");

			// Registros para el Reporte
			var registroItem = {};

			registroItem.rDescripcion = vlistItemFiltroFacturadoDescripcion;
			registroItem.rValorNeto = Intl.NumberFormat("de-DE").format(vlistItemFiltroFacturadoValorNeto);
			registroItem.rMoneda = vlistItemFiltroFacturadoMoneda;
			registroItem.rCantidad = vlistItemFiltroFacturadoCantidad;
			registroItem.rEstado = vlistItemFiltroFacturadoEstado;
			registroItem.rServicio = vlistItemFiltroFacturadoServicio;
			registroItem.rNumFacturaSunat = vlistItemFiltroFacturadoNumFacturaSunat;
			registroItem.rNumDocSap = vlistItemFiltroFacturadoNumDocSap;
			registroItem.rDireccionEntrega = vlistItemFiltroFacturadoDireccionEntrega;
			registroItem.clistItemFiltroFacturadoPrecio = clistItemFiltroFacturadoPrecio;

			// Insertar el registro en la tabla listConsultaResumenFacturado
			oModel.setProperty("/listConsultaResumenFacturado", registroItem);

			// Tabla Cronograma =================================================
			var oModelDetalleFiltro = oModel.getProperty("/listConsultaResumenOrden/rOrdenCompra");

			//Filtros
			var filters = [];
			var filter1 = new sap.ui.model.Filter("CR_NUM_ORDEN", sap.ui.model.FilterOperator.EQ, oModelDetalleFiltro);
			filters.push(filter1);
			var filter2 = new sap.ui.model.Filter("CR_NUM_ARTICULO", sap.ui.model.FilterOperator.EQ, vlistItemFiltroFacturadoIdCrono);
			filters.push(filter2);

			// Mostrar JSON
			var url = "/odatabnv/odata2.svc/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrixCronoFacturado = [];
			var registroCronoFacturado = {};
			oModelJson.read("/T_CRONOGRAMA?$format=json", {
				filters: filters,
				success: function (response) {
					try {
						var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
						var tamTabla = oModelJSON.getData().length;
						var contCronoFacturado = 0;
						for (var i = 0; i < tamTabla; i++) {
							registroCronoFacturado = {};
							registroCronoFacturado.clistItemCronogramaFacturadoFechaFactura = oModelJSON.getData()[i].CR_FEC_FACTURA;
							registroCronoFacturado.clistItemCronogramaFacturadoCantidadFacturado = oModelJSON.getData()[i].CR_CANTIDAD;
							registroCronoFacturado.clistItemCronogramaFacturadoValorFacturado = oModelJSON.getData()[i].CR_VALOR_FACTURADO;
							registroCronoFacturado.clistItemCronogramaFacturadoTipoImpuesto = oModelJSON.getData()[i].CR_TIPO_IMPUESTO;
							registroCronoFacturado.clistItemCronogramaFacturadoValorImpuesto = oModelJSON.getData()[i].CR_VALOR_IMPUESTO;
							registroCronoFacturado.clistItemCronogramaFacturadoMoneda = oModelJSON.getData()[i].CR_MONEDA;
							registroCronoFacturado.clistItemCronogramaFacturadoEstado = oModelJSON.getData()[i].CR_SITUACION2;
							matrixCronoFacturado.push(registroCronoFacturado);
							contCronoFacturado++;
						}

						// Insertar y Actualizar tabla Cronograma Facturado
						oModel.setProperty("/listItemCronogramaFacturado", matrixCronoFacturado);
						oThis.getView().byId("idTableItemCronogramaFacturado").getBinding("rows").refresh(true);

						// Numero de Registros para la Tabla Cronograma - Facturado
						var registroTotalItemCronogramaFacturado = {};
						registroTotalItemCronogramaFacturado.rCampoCronogramaFacturado = contCronoFacturado;
						oModel.setProperty("/listTotalItemCronogramaFacturado", registroTotalItemCronogramaFacturado);
						this.getView().setBusy(false);
					} catch (err) {
						this.getView().setBusy(false);
					}
				}.bind(this),

				error: function (oError) {
					this.getView().setBusy(false);
				}.bind(this)
			});

			this.getSplitAppObj().to(this.createId("detail6"));
		},

		btnSelectFactura3: function (oEvent) {
		this.getRouter().navTo("Vista_Control_Factura");
			// var oThis = this;
			// var oModel = oThis.getView().getModel("myParam");

			// var oTable = this.getView().byId("idTableItemEntregado");

			// var aSelectedIndices = oTable.getSelectedIndices();

			// var idCabecera = [];
			// var varCantAFacturar = [];
			// for (var i = 0; i < aSelectedIndices.length; i++) {
			// 	idCabecera[i] = oTable.getContextByIndex(aSelectedIndices[i]).sPath;
			// 	varCantAFacturar[i] = this.getView().byId("idTableItemEntregado").getRows()[aSelectedIndices[i]].getCells()[5].getValue();
			// }

			// var contCantidadAFacturar = 0;
			// for (var i = 0; i < aSelectedIndices.length; i++) {
			// 	if (varCantAFacturar[i] !== "0") {
			// 		contCantidadAFacturar = contCantidadAFacturar + 1;
			// 	}
			// }

			// oModel.setProperty("/listSelectDetalleFacturaEntregado", []);
			// var matrix = oModel.getProperty("/listSelectDetalleFacturaEntregado");
			// var registro = {};

			// if (aSelectedIndices.length !== 0) {

			// 	if (contCantidadAFacturar === aSelectedIndices.length) {

			// 		this.getRouter().navTo("Vista_Control_Factura");

			// 		var llave = {};
			// 		llave.rOpcion = "E";

			// 		// tabla listOpcion
			// 		oModel.setProperty("/listOpcion", llave);

			// 		for (i = 0; i < aSelectedIndices.length; i++) {
			// 			registro = {};
			// 			registro.clistSelectDetalleFacturaEntregadoPosicion = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoPosicion");
			// 			registro.clistSelectDetalleFacturaEntregadoAno = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoAno");
			// 			registro.clistSelectDetalleFacturaEntregadoBUKRS = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoBUKRS");
			// 			registro.clistSelectDetalleFacturaEntregadoCantidad = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoCantidad");
			// 			registro.clistSelectDetalleFacturaEntregadoCantidadAFacturar = varCantAFacturar[i];
			// 			registro.clistSelectDetalleFacturaEntregadoDescripcion = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroEntregadoDescripcion");
			// 			registro.clistSelectDetalleFacturaEntregadoDireccionEntrega = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroEntregadoDireccionEntrega");
			// 			registro.clistSelectDetalleFacturaEntregadoEstado = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoEstado");
			// 			registro.clistSelectDetalleFacturaEntregadoFechaRegistro = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroEntregadoFechaRegistro");
			// 			registro.clistSelectDetalleFacturaEntregadoGuiaRemision = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroEntregadoGuiaRemision");
			// 			registro.clistSelectDetalleFacturaEntregadoIdCrono = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoIdCrono");
			// 			registro.clistSelectDetalleFacturaEntregadoMoneda = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoMoneda");
			// 			registro.clistSelectDetalleFacturaEntregadoNumDocMaterial = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroEntregadoNumDocMaterial");
			// 			registro.clistSelectDetalleFacturaEntregadoNumMaterial = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroEntregadoNumMaterial");
			// 			registro.clistSelectDetalleFacturaEntregadoOrdenCompra = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroEntregadoOrdenCompra");
			// 			registro.clistSelectDetalleFacturaEntregadoPosicion = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoPosicion");
			// 			registro.clistSelectDetalleFacturaEntregadoPrecio = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoPrecio");
			// 			registro.clistSelectDetalleFacturaEntregadoValorNeto = oModel.getProperty(idCabecera[i] + "/clistItemFiltroEntregadoValorNeto");
			// 			matrix.push(registro);
			// 		}

			// 		oModel.setProperty("/listSelectDetalleFacturaEntregado", matrix);
			// 	} else {
			// 		var dialog = new sap.m.Dialog({
			// 			title: 'Alerta',
			// 			type: 'Message',
			// 			state: 'Error',
			// 			content: new sap.m.Text({
			// 				text: 'No se define la cantidad a facturar en uno de los Items.'
			// 			}),
			// 			beginButton: new sap.m.Button({
			// 				text: 'OK',
			// 				press: function () {
			// 					dialog.close();
			// 				}
			// 			}),
			// 			afterClose: function () {
			// 				dialog.destroy();
			// 			}
			// 		});
			// 		dialog.open();
			// 	}
			// } else {
			// 	var dialog = new sap.m.Dialog({
			// 		title: 'Error al Seleccionar',
			// 		type: 'Message',
			// 		state: 'Error',
			// 		content: new sap.m.Text({
			// 			text: 'Seleccione un Registro de la Tabla.'
			// 		}),
			// 		beginButton: new sap.m.Button({
			// 			text: 'OK',
			// 			press: function () {
			// 				dialog.close();
			// 			}
			// 		}),
			// 		afterClose: function () {
			// 			dialog.destroy();
			// 		}
			// 	});
			// 	dialog.open();
			// }
		},

		btnSelectFactura4: function () {
		this.getRouter().navTo("Vista_Control_Factura");
			// Llamar modelo
			// var oThis = this;
			// var oModel = oThis.getView().getModel("myParam");

			// var oTable = this.getView().byId("idTableItemAceptado");

			// var aSelectedIndices = oTable.getSelectedIndices();

			// var idCabecera = [];
			// var varCantAFacturar = [];
			// for (var i = 0; i < aSelectedIndices.length; i++) {
			// 	idCabecera[i] = oTable.getContextByIndex(aSelectedIndices[i]).sPath;
			// 	varCantAFacturar[i] = this.getView().byId("idTableItemAceptado").getRows()[aSelectedIndices[i]].getCells()[4].getValue();
			// }

			// var contCantidadAFacturar = 0;
			// for (var i = 0; i < aSelectedIndices.length; i++) {
			// 	if (varCantAFacturar[i] !== "0") {
			// 		contCantidadAFacturar = contCantidadAFacturar + 1;
			// 	}
			// }

			// if (aSelectedIndices.length !== 0) {

			// 	if (contCantidadAFacturar === aSelectedIndices.length) {

			// 		this.getRouter().navTo("Vista_Control_Factura");

			// 		var llave = {};
			// 		llave.rOpcion = "A";

			// 		// tabla listOpcion
			// 		oModel.setProperty("/listOpcion", llave);

			// 		oModel.setProperty("/listSelectDetalleFacturaAceptado", []);
			// 		var matrix = oModel.getProperty("/listSelectDetalleFacturaAceptado");
			// 		var registro = {};

			// 		for (i = 0; i < aSelectedIndices.length; i++) {
			// 			registro = {};
			// 			registro.clistSelectDetalleFacturaAceptadoPosicion = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoPosicion");
			// 			registro.clistSelectDetalleFacturaAceptadoAno = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoAno");
			// 			registro.clistSelectDetalleFacturaAceptadoBUKRS = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoBUKRS");
			// 			registro.clistSelectDetalleFacturaAceptadoCantidad = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoCantidad");
			// 			registro.clistSelectDetalleFacturaAceptadoCantidadAFacturar = varCantAFacturar[i];
			// 			registro.clistSelectDetalleFacturaAceptadoDescripcion = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoDescripcion");
			// 			registro.clistSelectDetalleFacturaAceptadoDireccionEntrega = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroAceptadoDireccionEntrega");
			// 			registro.clistSelectDetalleFacturaAceptadoEstado = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoEstado");
			// 			registro.clistSelectDetalleFacturaAceptadoFechaAceptacion = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroAceptadoFechaAceptacion");
			// 			registro.clistSelectDetalleFacturaAceptadoHojaEntrada = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoHojaEntrada");
			// 			registro.clistSelectDetalleFacturaAceptadoIdCrono = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoIdCrono");
			// 			registro.clistSelectDetalleFacturaAceptadoMoneda = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoMoneda");
			// 			registro.clistSelectDetalleFacturaAceptadoNumAceptacion = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroAceptadoNumAceptacion");
			// 			registro.clistSelectDetalleFacturaAceptadoNumDocMaterial = oModel.getProperty(idCabecera[i] +
			// 				"/clistItemFiltroAceptadoNumDocMaterial");
			// 			registro.clistSelectDetalleFacturaAceptadoOrdenCompra = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoOrdenCompra");
			// 			registro.clistSelectDetalleFacturaAceptadoPosicion = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoPosicion");
			// 			registro.clistSelectDetalleFacturaAceptadoPrecio = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoPrecio");
			// 			registro.clistSelectDetalleFacturaAceptadoServicio = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoServicio");
			// 			registro.clistSelectDetalleFacturaAceptadoValorNeto = oModel.getProperty(idCabecera[i] + "/clistItemFiltroAceptadoValorNeto");
			// 			matrix.push(registro);
			// 		}

			// 		oModel.setProperty("/listSelectDetalleFacturaAceptado", matrix);

			// 	} else {
			// 		var dialog = new sap.m.Dialog({
			// 			title: 'Alerta',
			// 			type: 'Message',
			// 			state: 'Error',
			// 			content: new sap.m.Text({
			// 				text: 'No se define la cantidad a facturar en uno de los Items.'
			// 			}),
			// 			beginButton: new sap.m.Button({
			// 				text: 'OK',
			// 				press: function () {
			// 					dialog.close();
			// 				}
			// 			}),
			// 			afterClose: function () {
			// 				dialog.destroy();
			// 			}
			// 		});
			// 		dialog.open();
			// 	}
			// } else {
			// 	var dialog = new sap.m.Dialog({
			// 		title: 'Error al Seleccionar',
			// 		type: 'Message',
			// 		state: 'Error',
			// 		content: new sap.m.Text({
			// 			text: 'Seleccione un Registro de la Tabla.'
			// 		}),
			// 		beginButton: new sap.m.Button({
			// 			text: 'OK',
			// 			press: function () {
			// 				dialog.close();
			// 			}
			// 		}),
			// 		afterClose: function () {
			// 			dialog.destroy();
			// 		}
			// 	});
			// 	dialog.open();
			// }
		}
	});
});