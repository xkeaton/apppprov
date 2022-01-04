sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("nspprov.ui5apppprov.controller.Vista_Registro_Factura_Manual", {
		ordenCompraGlobal: null,
		posFacturaGlobal: null,
		onAfterRendering: function () {
			var oSplitApp = this.getView().byId("SplitAppDemo1");
			var oMasterNav = oSplitApp.getAggregation("_navMaster");

			var idComboTipoDoc = this.getView().byId("idTipoDoc");
			idComboTipoDoc.getBinding("items").refresh(true);
			var firstItem = idComboTipoDoc.getItems()[0];
			idComboTipoDoc.setSelectedItem(firstItem, true);
			oMasterNav.setVisible(false);
		},
		onInit: function () {
			var oThis = this;
			oThis.getRouter().getRoute("Vista_Registro_Factura_Manual").attachMatched(this._onRouteMatched, this);
			this.getView().byId("idTableItemDetalleFac").setSelectionMode("Single");
			this.getView().byId("idTableItemDetalleFac").setSelectionBehavior("RowOnly");
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().byId("SplitAppDemo1").addStyleClass("miSplit");
			this.getView().byId("idNav").addStyleClass("miIconoBlanco");
		},
		calcular: function (evt) {

			var neto = sap.ui.getCore().byId("idneto").getValue();
			if (neto === "" || neto === null || neto === undefined) {
				neto = 0;
			}
			neto = parseFloat(neto.toString());
			var descuento = sap.ui.getCore().byId("idDescuento").getValue();
			if (descuento === "" || descuento === null || descuento === undefined) {
				descuento = 0;
			}
			descuento = parseFloat(descuento.toString());
			var cantidad = sap.ui.getCore().byId("idCantidad").getValue();
			if (cantidad === "" || cantidad === null || cantidad === undefined) {
				cantidad = 0;
			}
			cantidad = parseInt(cantidad.toString());
			var tasaIGV = this.getView().byId("idTasaIGV").getValue();
			if (tasaIGV === "" || tasaIGV === null || tasaIGV === null) {
				tasaIGV = 0;
			} else {
				tasaIGV = parseFloat(tasaIGV.toString()) / 100;
			}
			var calculoPrecioUnitarioItem = 0;
			var IGV = sap.ui.getCore().byId("idLabelIGV").getText();
			if (IGV === "CON IGV") {
				calculoPrecioUnitarioItem = neto / (1 + tasaIGV);
			} else {
				calculoPrecioUnitarioItem = neto / (1);
			}
			sap.ui.getCore().byId("idPreUnitario").setValue(calculoPrecioUnitarioItem.toFixed(2));
			var valorVentaBruto = cantidad * calculoPrecioUnitarioItem;
			var valorVentaPorItem = valorVentaBruto - descuento;
			sap.ui.getCore().byId("idValorVentaItem").setValue(valorVentaPorItem.toFixed(2));
			var IGVdeItem = 0;
			if (IGV === "CON IGV") {
				IGVdeItem = valorVentaPorItem * tasaIGV;
			} else {
				IGVdeItem = valorVentaPorItem * 0;
			}
			var valorNeto = IGVdeItem + valorVentaPorItem;
			sap.ui.getCore().byId("idPreVenta").setValue(valorNeto.toFixed(2));
		},
		calcularTabla: function (evt) {
			var tasaIGV = this.getView().byId("idTasaIGV").getValue();
			if (tasaIGV === "" || tasaIGV === null || tasaIGV === null) {
				tasaIGV = 0;
			} else {
				tasaIGV = parseFloat(tasaIGV.toString()) / 100;
			}

			var oModel = this.getView().getModel("myParam");
			var tablaFactura = oModel.getProperty("/listItemDetalleFactura");
			var lenghtTabla = tablaFactura.length;
			for (var i = 0; i < lenghtTabla; i++) {
				var neto = tablaFactura[i].clistItemDetalleFacturaValortotalNetoXItem;
				neto = parseFloat(neto.toString());

				var descuento = tablaFactura[i].clistItemDetalleFacturaTotDescuento;
				descuento = parseFloat(descuento.toString());

				var cantidad = tablaFactura[i].clistItemDetalleFacturaCantidad;
				cantidad = parseFloat(cantidad.toString());

				var IGV = tablaFactura[i].clistItemDetalleFacturaConIGV;
				var calculoPrecioUnitarioItem = 0;
				if (IGV === "si") {
					calculoPrecioUnitarioItem = neto / (1 + tasaIGV);
				} else {
					calculoPrecioUnitarioItem = neto / (1);
				}
				tablaFactura[i].clistItemDetalleFacturaPreUnixItem = calculoPrecioUnitarioItem.toFixed(2);
				var valorVentaBruto = cantidad * calculoPrecioUnitarioItem;
				var valorVentaPorItem = valorVentaBruto - descuento;
				tablaFactura[i].clistItemDetalleFacturaValorVentaItem = valorVentaPorItem.toFixed(2);
				var IGVdeItem = 0;
				if (IGV === "si") {
					IGVdeItem = valorVentaPorItem * tasaIGV;
				} else {
					IGVdeItem = valorVentaPorItem * 0;
				}
				var valorNeto = IGVdeItem + valorVentaPorItem;
				tablaFactura[i].clistItemDetalleFacturaPreVenxItem = valorNeto.toFixed(2);

			}
			oModel.setProperty("/listItemDetalleFactura", tablaFactura);
			this.getView().byId("idTableItemDetalleFac").getBinding("rows").refresh(true);
			this.calcularTotales();
		},
		calcularTotales: function (evt) {
			var tasaIGV = this.getView().byId("idTasaIGV").getValue();
			if (tasaIGV === "" || tasaIGV === null || tasaIGV === null) {
				tasaIGV = 0;
			} else {
				tasaIGV = parseFloat(tasaIGV.toString()) / 100;
			}
			var porcDesGlo = this.getView().byId("idPorcentajeDesGlo").getValue();
			if (porcDesGlo === "" || porcDesGlo === null || porcDesGlo === null) {
				porcDesGlo = 0;
			} else {
				porcDesGlo = parseFloat(porcDesGlo.toString()) / 100;
			}

			var oModel = this.getView().getModel("myParam");
			var tablaFactura = oModel.getProperty("/listItemDetalleFactura");
			var lenghtTabla = tablaFactura.length;
			var totalDescuento = 0;
			var totalVentaVentaItem = 0;
			var totalFacturaTipoAfeccion = 0;
			var totalValorReferencial = 0;
			for (var i = 0; i < lenghtTabla; i++) {
				totalDescuento += parseFloat(tablaFactura[i].clistItemDetalleFacturaTotDescuento.toString());
				totalVentaVentaItem += parseFloat(tablaFactura[i].clistItemDetalleFacturaValorVentaItem.toString());
				totalValorReferencial += parseFloat(tablaFactura[i].clistItemDetalleFacturaValorReferencial.toString());
				if (tablaFactura[i].clistItemDetalleFacturaTipoAfeccion.toString() === "Gravado") {
					totalFacturaTipoAfeccion += parseFloat(tablaFactura[i].clistItemDetalleFacturaValorVentaItem.toString());
				}
			}
			var descuentoGlobal = totalVentaVentaItem * porcDesGlo;
			var totalDescuentoS = descuentoGlobal + totalDescuento;
			this.getView().byId("idTotalDescuentos").setValue(totalDescuentoS.toFixed(2));
			var totalVentaGravada = totalFacturaTipoAfeccion - totalFacturaTipoAfeccion * porcDesGlo;
			var sumatoriaIGV = totalVentaGravada * tasaIGV;
			this.getView().byId("idTotalIGV").setValue(sumatoriaIGV.toFixed(2));
			var importeTotalVenta = totalVentaVentaItem + sumatoriaIGV + totalValorReferencial - descuentoGlobal;
			this.getView().byId("idImporteTotal").setValue(importeTotalVenta.toFixed(2));
		},
		evtChangeTasa: function (evt) {
			var valor = evt.getSource().getValue();
			var valorSplit = valor.split(".");
			if (valorSplit.length === 2) {
				if (valorSplit[1].length > 2) {
					valor = parseFloat(valor.toString()).toFixed(2);
					this.getView().byId("idTasaIGV").setValue(valor);

				}
			}
			this.calcularTabla();
		},
		pressEliminarLista: function (evt) {
			var objeto = evt.getSource().getBindingContext("myParam").getObject();
			var listItemDetalleFactura = this.getView().getModel().getProperty("/listItemDetalleFactura");
			var lenghtOrden = listItemDetalleFactura.length;
			for (var i = 0; i < lenghtOrden; i++) {
				if (listItemDetalleFactura[i].clistItemDetalleFacturaPosicion === objeto.clistItemDetalleFacturaPosicion) {
					listItemDetalleFactura.splice(i, 1);
					this.getView().getModel().setProperty("/listItemDetalleFactura", listItemDetalleFactura);
					this.getView().byId("idTableItemDetalleFac").getBinding("rows").refresh(true);
					sap.m.MessageToast.show("Se eliminó el registro factura " + objeto.clistItemDetalleFacturaCodigo + "-" + objeto.clistItemDetalleFacturaDescripcion +
						" .");
					this.calcularTotales();
					this.verificarAsignaciónPosFactura();
					return;
				}
			}
		},
		evtChangePorcentaje: function (evt) {
			var valor = evt.getSource().getValue();
			var valorSplit = valor.split(".");
			if (valorSplit.length === 2) {
				if (valorSplit[1].length > 2) {
					valor = parseFloat(valor.toString()).toFixed(2);
					this.getView().byId("idPorcentajeDesGlo").setValue(valor);

				}
			}
			this.calcularTabla();
		},
		pressAnadirLista: function (evt) {
			var model = this.getView().getModel();
			sap.ui.getCore().setModel(model);
			var oDialogInsOrdenIngreso = new sap.m.Dialog("idDialogInsOrdenIngreso", {
				title: "Añadir registro",
				type: "Message",
				contentWidth: "900px",
				icon: "sap-icon://activity-items",
				state: "Information",
				draggable: true,
				resizable: true,
				content: [
					new sap.m.Label({
						text: "Precio Neto:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Cantidad:",
						width: "48%"
					}),
					new sap.m.Input({
						maxLength: 20,
						id: "idneto",
						type: "Number",
						valueStateText: "El campo precio neto no debe estar vacío.",
						placeholder: "Ingrese precio neto (20)...",
						required: true,
						width: "48%",
						change: function () {
							this.calcular();
						}.bind(this)
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						maxLength: 6,
						id: "idCantidad",
						type: "Number",
						valueStateText: "El campo cantidad no debe estar vacío.",
						placeholder: "Ingrese cantidad (6)...",
						required: true,
						width: "48%",
						change: function () {
							this.calcular();
						}.bind(this)
					}),
					new sap.m.Label({
						text: "Código del producto:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Descuento:",
						width: "48%"
					}),
					new sap.m.Input({
						maxLength: 6,
						id: "idcodProducto",
						valueStateText: "El campo código del producto no debe estar vacío.",
						placeholder: "Ingrese código del producto (6)...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						maxLength: 20,
						id: "idDescuento",
						type: "Number",
						valueStateText: "El campo descuento no debe estar vacío.",
						placeholder: "Ingrese descuento (20)...",
						required: true,
						width: "48%",
						change: function () {
							this.calcular();
						}.bind(this)
					}),
					new sap.m.Label({
						text: "Descripción del producto:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Precio unitario por Item:",
						width: "48%"
					}),
					new sap.m.Input({
						maxLength: 100,
						id: "iddesProducto",
						valueStateText: "El campo descripción del producto no debe estar vacío.",
						placeholder: "Ingrese descripción del producto (100)...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						id: "idPreUnitario",
						valueStateText: "El campo precio unitario por Item no debe estar vacío.",
						value: "0",
						editable: false,
						placeholder: "Calcular precio unitario...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "Unidad:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Precio venta por Item:",
						width: "48%"
					}),
					new sap.m.Input({
						maxLength: 3,
						id: "idUnidad",
						valueStateText: "El campo unidad no debe estar vacío.",
						placeholder: "Ingrese unidad (3)...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						id: "idPreVenta",
						editable: false,
						valueStateText: "El campo precio venta por Item no debe estar vacío.",
						value: "0",
						placeholder: "Calcular precio venta...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "Afectación al IGV:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Valor de venta por item:",
						width: "48%"
					}),
					new sap.m.ComboBox({
						id: "idAfectacionIGV",
						valueStateText: "Se requiere seleccionar una afectación al IGV.",
						placeholder: "Seleccione  afectación al IGV ...", // string
						items: {
							path: "/afectacionIGV",
							template: new sap.ui.core.Item({
								key: "{opcion}",
								text: "{valor} | {descripcion}"
							})
						},
						selectionChange: function (evt) {
							var llave = evt.getSource().getSelectedItem();
							if (llave !== null && llave !== undefined) {
								llave = llave.getKey();
								if (llave === "si") {
									sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://paid-leave");
									sap.ui.getCore().byId("idLabelIGV").setText("CON IGV");
								} else {
									sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://unpaid-leave");
									sap.ui.getCore().byId("idLabelIGV").setText("SIN IGV");
								}
							} else {
								sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://paid");
								sap.ui.getCore().byId("idLabelIGV").setText("-Sin seleccionar-");
							}
						},
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						id: "idValorVentaItem",
						editable: false,
						valueStateText: "El campo valor venta por Item no debe estar vacío.",
						value: "0",
						placeholder: "Calcular valor venta...",
						required: true,
						width: "48%"
					}),

					new sap.m.Label({
						text: "Valor referencial unitario por ítem en operaciones:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "52%"
					}),
					new sap.m.Input({
						maxLength: 20,
						id: "idValorReferencial",
						type: "Number",
						valueStateText: "El campo valor referencial no debe estar vacío.",
						placeholder: "Ingrese valor referencial (20)...",
						value: "0.00",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "52%"
					}),
					new sap.m.Toolbar({
						width: "100%",
						content: [
							new sap.ui.core.Icon({
								src: "sap-icon://sales-order-item",
								color: "#0854a0",
								width: "1rem"
							}),
							new sap.m.Label({
								id: "idLabelFactura"
							}),
							new sap.ui.core.Icon({
								src: "sap-icon://date-time",
								color: "#0854a0",
								width: "1rem"
							}),
							new sap.m.Label({
								id: "idLabelFechaReg"
							}),
							new sap.m.ToolbarSpacer({}), new sap.ui.core.Icon({
								id: "idIconUpdate01",
								src: "sap-icon://waiver",
								color: "#0854a0",
								width: "1rem"
							}),
							new sap.m.Label({
								id: "idLabelTasaIGV"
							}),
							new sap.ui.core.Icon({
								id: "idIconUpdate02",
								src: "sap-icon://paid-leave",
								color: "#0854a0",
								width: "1rem"
							}),
							new sap.m.Label({
								id: "idLabelIGV"
							})
						]
					})
				],
				beginButton: new sap.m.Button("btnOIGuardar", {
					icon: "sap-icon://save",
					text: "Guardar",
					visible: true,
					press: function () {
						var canContinue = true;
						var fechas = [
							sap.ui.getCore().byId("idcodProducto"),
							sap.ui.getCore().byId("iddesProducto"),
							sap.ui.getCore().byId("idUnidad"),
							sap.ui.getCore().byId("idCantidad"),
							sap.ui.getCore().byId("idPreUnitario"),
							sap.ui.getCore().byId("idPreVenta"),
							sap.ui.getCore().byId("idDescuento"),
							sap.ui.getCore().byId("idValorVentaItem"),
							sap.ui.getCore().byId("idValorReferencial"),
							sap.ui.getCore().byId("idneto")
						];
						var selects = [
							sap.ui.getCore().byId("idAfectacionIGV")
						];
						jQuery.each(fechas, function (i, fecha) {
							if (!fecha.getValue()) {
								fecha.setValueState("Error");
								canContinue = false;
							} else {
								fecha.setValueState("None");
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

							var oModel = this.getView().getModel("myParam");
							var listItemDetalleFactura = oModel.getProperty("/listItemDetalleFactura");
							var listLength = listItemDetalleFactura.length;
							listLength++;
							var llaveDetalle = {};
							var objetoIGV = sap.ui.getCore().byId("idAfectacionIGV").getSelectedItem().getBindingContext().getObject();
							llaveDetalle.clistItemDetalleFacturaPosicion = listLength.toString();
							llaveDetalle.clistItemDetalleFacturaEstado = "Sin Asignar";
							llaveDetalle.clistItemDetalleFacturaCodigo = sap.ui.getCore().byId("idcodProducto").getValue();
							llaveDetalle.clistItemDetalleFacturaDescripcion = sap.ui.getCore().byId("iddesProducto").getValue();
							llaveDetalle.clistItemDetalleFacturaUniMedida = sap.ui.getCore().byId("idUnidad").getValue();
							llaveDetalle.clistItemDetalleFacturaCantidad = sap.ui.getCore().byId("idCantidad").getValue();
							var igv = sap.ui.getCore().byId("idLabelIGV").getText();
							llaveDetalle.clistItemDetalleFacturaAfectacionIGV = igv;
							llaveDetalle.clistItemDetalleFacturaPreUnixItem = sap.ui.getCore().byId("idPreUnitario").getValue();

							llaveDetalle.clistItemDetalleFacturaValorVentaItem = sap.ui.getCore().byId("idValorVentaItem").getValue();
							llaveDetalle.clistItemDetalleFacturaPreVenxItem = sap.ui.getCore().byId("idPreVenta").getValue();
							llaveDetalle.clistItemDetalleFacturaTotDescuento = sap.ui.getCore().byId("idDescuento").getValue();
							llaveDetalle.clistItemDetalleFacturaValorReferencial = sap.ui.getCore().byId("idValorReferencial").getValue();
							llaveDetalle.clistItemDetalleFacturaTotal = "0";
							llaveDetalle.clistItemDetalleFacturaValortotalNetoXItem = parseFloat(sap.ui.getCore().byId("idneto").getValue()).toFixed(2);
							llaveDetalle.clistItemDetalleFacturaTipoAfeccion = objetoIGV.tipo;
							llaveDetalle.clistItemDetalleFacturaConIGV = objetoIGV.opcion;
							llaveDetalle.clistItemDetalleFacturaValor = objetoIGV.valor;
							llaveDetalle.clistItemsOrdenCompra = [];
							listItemDetalleFactura.push(llaveDetalle);
							this.getView().byId("idTableItemDetalleFac").getBinding("rows").refresh(true);
							oModel.setProperty("/listItemDetalleFactura", listItemDetalleFactura);
							this.calcularTotales();
							sap.m.MessageToast.show("Se agregó correctamente el producto " + llaveDetalle.clistItemDetalleFacturaCodigo + "-" +
								llaveDetalle.clistItemDetalleFacturaDescripcion + " .");
							oDialogInsOrdenIngreso.close();
							this.verificarAsignaciónPosFactura();
						} else {
							var dialog = new sap.m.Dialog({
								title: "Alerta",
								type: "Message",
								state: "Warning",
								content: new sap.m.Text({
									text: "Se requiere seleccionar/ingresar todos los campos."

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
					icon: "sap-icon://cancel",
					text: "Cerrar",
					press: function () {
						oDialogInsOrdenIngreso.close();
					}
				}),
				afterClose: function () {
					oDialogInsOrdenIngreso.destroy();
				},
				afterOpen: function () {
					var idAfectacionIGV = sap.ui.getCore().byId("idAfectacionIGV");
					var firstItem = idAfectacionIGV.getItems()[0];
					idAfectacionIGV.setSelectedItem(firstItem, true);

					var facturaNombre = this.getView().byId("idFacturaNumbre").getValue();
					if (facturaNombre === "" || facturaNombre === null) {
						facturaNombre = "-Sin ingresar-";
					}
					sap.ui.getCore().byId("idLabelFactura").setText("Factura Electrónica : " + facturaNombre);
					var fecEmision = this.getView().byId("idFecEmision").getValue();
					if (fecEmision === "" || fecEmision === null) {
						fecEmision = "-Sin ingresar-";
					}
					sap.ui.getCore().byId("idLabelFechaReg").setText("Fecha de emisión : " + fecEmision);
					var tasaIGV = this.getView().byId("idTasaIGV").getValue();
					if (tasaIGV === "" || tasaIGV === null) {
						tasaIGV = "-Sin ingresar-";
					} else {
						tasaIGV = tasaIGV + "%";
					}
					sap.ui.getCore().byId("idLabelTasaIGV").setText("Tasa de IGV : " + tasaIGV);
					sap.ui.getCore().byId("idLabelIGV").setText("CON IGV");
				}.bind(this)
			});
			oDialogInsOrdenIngreso.open();
		},
		pressEditarLista: function (evt) {
			var oItem = evt.getSource();
			var oContext = oItem.getBindingContext("myParam");
			var path = oContext.getPath();
			var object = oContext.getObject();
			// Obtener el ID principal de lo seleccionado

			var model = this.getView().getModel();
			sap.ui.getCore().setModel(model);
			var oDialogInsOrdenIngreso = new sap.m.Dialog("idDialogInsOrdenIngreso", {
				title: "Editar registro",
				type: "Message",
				contentWidth: "900px",
				icon: "sap-icon://request",
				state: "Information",
				draggable: true,
				resizable: true,
				content: [
					new sap.m.Label({
						text: "Precio Neto:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Cantidad:",
						width: "48%"
					}),

					// llaveDetalle.clistItemDetalleFacturaPosicion = listLength.toString();
					// llaveDetalle.clistItemDetalleFacturaEstado = "Sin Asignar";
					// llaveDetalle.clistItemDetalleFacturaCodigo = sap.ui.getCore().byId("idcodProducto").getValue();
					// llaveDetalle.clistItemDetalleFacturaDescripcion = sap.ui.getCore().byId("iddesProducto").getValue();
					// llaveDetalle.clistItemDetalleFacturaUniMedida = sap.ui.getCore().byId("idUnidad").getValue();
					// llaveDetalle.clistItemDetalleFacturaCantidad = sap.ui.getCore().byId("idCantidad").getValue();
					// var igv = sap.ui.getCore().byId("idLabelIGV").getText();
					// llaveDetalle.clistItemDetalleFacturaAfectacionIGV = igv;
					// llaveDetalle.clistItemDetalleFacturaPreUnixItem = sap.ui.getCore().byId("idPreUnitario").getValue();

					// llaveDetalle.clistItemDetalleFacturaValorVentaItem = sap.ui.getCore().byId("idValorVentaItem").getValue();

					// llaveDetalle.clistItemDetalleFacturaPreVenxItem = sap.ui.getCore().byId("idPreVenta").getValue();
					// llaveDetalle.clistItemDetalleFacturaTotDescuento = sap.ui.getCore().byId("idDescuento").getValue();
					// llaveDetalle.clistItemDetalleFacturaValorReferencial = sap.ui.getCore().byId("idValorReferencial").getValue();
					// llaveDetalle.clistItemDetalleFacturaTotal = "0";
					// llaveDetalle.clistItemDetalleFacturaValortotalNetoXItem = sap.ui.getCore().byId("idneto").getValue();
					// llaveDetalle.clistItemDetalleFacturaTipoAfeccion = objetoIGV.tipo;
					// llaveDetalle.clistItemDetalleFacturaConIGV = objetoIGV.opcion;
					// llaveDetalle.clistItemsOrdenCompra = [];

					new sap.m.Input({
						maxLength: 20,
						id: "idneto",
						value: object.clistItemDetalleFacturaValortotalNetoXItem,
						type: "Number",
						valueStateText: "El campo precio neto no debe estar vacío.",
						placeholder: "Ingrese precio neto (20)...",
						required: true,
						width: "48%",
						change: function () {
							this.calcular();
						}.bind(this)
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						maxLength: 6,
						id: "idCantidad",
						value: object.clistItemDetalleFacturaCantidad,
						type: "Number",
						valueStateText: "El campo cantidad no debe estar vacío.",
						placeholder: "Ingrese cantidad (6)...",
						required: true,
						width: "48%",
						change: function () {
							this.calcular();
						}.bind(this)
					}),
					new sap.m.Label({
						text: "Código del producto:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Descuento:",
						width: "48%"
					}),
					new sap.m.Input({
						maxLength: 6,
						id: "idcodProducto",
						value: object.clistItemDetalleFacturaCodigo,
						valueStateText: "El campo código del producto no debe estar vacío.",
						placeholder: "Ingrese código del producto (6)...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						maxLength: 20,
						id: "idDescuento",
						value: object.clistItemDetalleFacturaTotDescuento,
						type: "Number",
						valueStateText: "El campo descuento no debe estar vacío.",
						placeholder: "Ingrese descuento (20)...",
						required: true,
						width: "48%",
						change: function () {
							this.calcular();
						}.bind(this)
					}),
					new sap.m.Label({
						text: "Descripción del producto:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Precio unitario por Item:",
						width: "48%"
					}),
					new sap.m.Input({
						maxLength: 100,
						id: "iddesProducto",
						value: object.clistItemDetalleFacturaDescripcion,
						valueStateText: "El campo descripción del producto no debe estar vacío.",
						placeholder: "Ingrese descripción del producto (100)...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						id: "idPreUnitario",
						value: object.clistItemDetalleFacturaPreUnixItem,
						valueStateText: "El campo precio unitario por Item no debe estar vacío.",
						editable: false,
						placeholder: "Calcular precio unitario...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "Unidad:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Precio venta por Item:",
						width: "48%"
					}),
					new sap.m.Input({
						maxLength: 3,
						id: "idUnidad",
						value: object.clistItemDetalleFacturaUniMedida,
						valueStateText: "El campo unidad no debe estar vacío.",
						placeholder: "Ingrese unidad (3)...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						id: "idPreVenta",
						editable: false,
						value: object.clistItemDetalleFacturaPreVenxItem,
						valueStateText: "El campo precio venta por Item no debe estar vacío.",
						placeholder: "Calcular precio venta...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "Afectación al IGV:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Label({
						text: "Valor de venta por item:",
						width: "48%"
					}),
					new sap.m.ComboBox({
						id: "idAfectacionIGV",
						valueStateText: "Se requiere seleccionar una afectación al IGV.",
						placeholder: "Seleccione  afectación al IGV ...", // string
						items: {
							path: "/afectacionIGV",
							template: new sap.ui.core.Item({
								key: "{opcion}",
								text: "{valor} | {descripcion}"
							})
						},
						selectionChange: function (evt) {
							var llave = evt.getSource().getSelectedItem();
							if (llave !== null && llave !== undefined) {
								llave = llave.getKey();
								if (llave === "si") {
									sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://paid-leave");
									sap.ui.getCore().byId("idLabelIGV").setText("CON IGV");
								} else {
									sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://unpaid-leave");
									sap.ui.getCore().byId("idLabelIGV").setText("SIN IGV");
								}
							} else {
								sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://paid");
								sap.ui.getCore().byId("idLabelIGV").setText("-Sin seleccionar-");
							}
						},
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "4%"
					}),
					new sap.m.Input({
						id: "idValorVentaItem",
						editable: false,
						value: object.clistItemDetalleFacturaValorVentaItem,
						valueStateText: "El campo valor venta por Item no debe estar vacío.",
						placeholder: "Calcular valor venta...",
						required: true,
						width: "48%"
					}),

					new sap.m.Label({
						text: "Valor referencial unitario por ítem en operaciones:",
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "52%"
					}),
					new sap.m.Input({
						maxLength: 20,
						id: "idValorReferencial",
						value: object.clistItemDetalleFacturaValorReferencial,
						type: "Number",
						valueStateText: "El campo valor referencial no debe estar vacío.",
						placeholder: "Ingrese valor referencial (20)...",
						required: true,
						width: "48%"
					}),
					new sap.m.Label({
						text: "",
						width: "52%"
					}),
					new sap.m.Toolbar({
						width: "100%",
						content: [
							new sap.ui.core.Icon({
								src: "sap-icon://sales-order-item",
								color: "#0854a0",
								width: "1rem"
							}),
							new sap.m.Label({
								id: "idLabelFactura"
							}),
							new sap.ui.core.Icon({
								src: "sap-icon://date-time",
								color: "#0854a0",
								width: "1rem"
							}),
							new sap.m.Label({
								id: "idLabelFechaReg"
							}),
							new sap.m.ToolbarSpacer({}), new sap.ui.core.Icon({
								id: "idIconUpdate01",
								src: "sap-icon://waiver",
								color: "#0854a0",
								width: "1rem"
							}),
							new sap.m.Label({
								id: "idLabelTasaIGV"
							}),
							new sap.ui.core.Icon({
								id: "idIconUpdate02",
								src: "sap-icon://paid-leave",
								color: "#0854a0",
								width: "1rem"
							}),
							new sap.m.Label({
								id: "idLabelIGV"
							})
						]
					})

				],
				beginButton: new sap.m.Button("btnOIGuardar", {
					icon: "sap-icon://save",
					text: "Actualizar",
					visible: true,
					press: function () {
						var canContinue = true;
						var fechas = [
							sap.ui.getCore().byId("idcodProducto"),
							sap.ui.getCore().byId("iddesProducto"),
							sap.ui.getCore().byId("idUnidad"),
							sap.ui.getCore().byId("idCantidad"),
							sap.ui.getCore().byId("idPreUnitario"),
							sap.ui.getCore().byId("idPreVenta"),
							sap.ui.getCore().byId("idDescuento"),
							sap.ui.getCore().byId("idValorVentaItem"),
							sap.ui.getCore().byId("idValorReferencial"),
							sap.ui.getCore().byId("idneto")
						];
						var selects = [
							sap.ui.getCore().byId("idAfectacionIGV")
						];
						jQuery.each(fechas, function (i, fecha) {
							if (!fecha.getValue()) {
								fecha.setValueState("Error");
								canContinue = false;
							} else {
								fecha.setValueState("None");
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

							var oModel = this.getView().getModel("myParam");
							var objetoIGV = sap.ui.getCore().byId("idAfectacionIGV").getSelectedItem().getBindingContext().getObject();
							// llaveDetalle.clistItemDetalleFacturaEstado = "Sin Asignar";
							var idcodProducto = sap.ui.getCore().byId("idcodProducto").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaCodigo", idcodProducto);
							var iddesProducto = sap.ui.getCore().byId("iddesProducto").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaDescripcion", iddesProducto);
							var idUnidad = sap.ui.getCore().byId("idUnidad").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaUniMedida", idUnidad);
							var idCantidad = sap.ui.getCore().byId("idCantidad").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaCantidad", idCantidad);
							var igv = sap.ui.getCore().byId("idLabelIGV").getText();
							oModel.setProperty(path + "/clistItemDetalleFacturaAfectacionIGV", igv);
							var idPreUnitario = sap.ui.getCore().byId("idPreUnitario").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaPreUnixItem", idPreUnitario);

							var idValorVentaItem = sap.ui.getCore().byId("idValorVentaItem").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaValorVentaItem", idValorVentaItem);

							var idPreVenta = sap.ui.getCore().byId("idPreVenta").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaPreVenxItem", idPreVenta);
							var idDescuento = sap.ui.getCore().byId("idDescuento").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaTotDescuento", idDescuento);
							var idValorReferencial = sap.ui.getCore().byId("idValorReferencial").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaValorReferencial", idValorReferencial);
							var idneto = sap.ui.getCore().byId("idneto").getValue();
							oModel.setProperty(path + "/clistItemDetalleFacturaValortotalNetoXItem", idneto);
							oModel.setProperty(path + "/clistItemDetalleFacturaTipoAfeccion", objetoIGV.tipo);
							oModel.setProperty(path + "/clistItemDetalleFacturaConIGV", objetoIGV.opcion);
							oModel.setProperty(path + "/clistItemDetalleFacturaValor", objetoIGV.valor);
							this.getView().byId("idTableItemDetalleFac").getBinding("rows").refresh(true);
							this.calcularTotales();
							sap.m.MessageToast.show("Se actualizó correctamente el producto " + idcodProducto + "-" +
								iddesProducto + " .");
							oDialogInsOrdenIngreso.close();

							this.posFacturaGlobal = path;
							var clistItemsOrdenCompra = oModel.getProperty(path + "/clistItemsOrdenCompra");
							this.subTotalOrdenCompra(clistItemsOrdenCompra);
							//	this.verificarAsignaciónPosFactura();
						} else {
							var dialog = new sap.m.Dialog({
								title: "Alerta",
								type: "Message",
								state: "Warning",
								content: new sap.m.Text({
									text: "Se requiere seleccionar/ingresar todos los campos."

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
					icon: "sap-icon://cancel",
					text: "Cerrar",
					press: function () {
						oDialogInsOrdenIngreso.close();
					}
				}),
				afterClose: function () {
					oDialogInsOrdenIngreso.destroy();
				},
				afterOpen: function () {
					var idAfectacionIGV = sap.ui.getCore().byId("idAfectacionIGV");
					var firstItem = idAfectacionIGV.getItems()[0];
					idAfectacionIGV.setSelectedItem(firstItem, true);

					var facturaNombre = this.getView().byId("idFacturaNumbre").getValue();
					if (facturaNombre === "" || facturaNombre === null) {
						facturaNombre = "-Sin ingresar-";
					}
					sap.ui.getCore().byId("idLabelFactura").setText("Factura Electrónica : " + facturaNombre);
					var fecEmision = this.getView().byId("idFecEmision").getValue();
					if (fecEmision === "" || fecEmision === null) {
						fecEmision = "-Sin ingresar-";
					}
					sap.ui.getCore().byId("idLabelFechaReg").setText("Fecha de emisión : " + fecEmision);
					var tasaIGV = this.getView().byId("idTasaIGV").getValue();
					if (tasaIGV === "" || tasaIGV === null) {
						tasaIGV = "-Sin ingresar-";
					} else {
						tasaIGV = tasaIGV + "%";
					}
					sap.ui.getCore().byId("idLabelTasaIGV").setText("Tasa de IGV : " + tasaIGV);
					sap.ui.getCore().byId("idLabelIGV").setText("CON IGV");

					if (object.clistItemDetalleFacturaValor !== null && object.clistItemDetalleFacturaValor !== "" && object.clistItemDetalleFacturaValor !==
						undefined) {
						var items = sap.ui.getCore().byId("idAfectacionIGV").getItems();
						var texto = "";
						var llave = "";
						for (var i = 0; i < items.length; i++) {
							texto = items[i].getText();
							texto = texto.split(" | ");
							if (object.clistItemDetalleFacturaValor === texto[0]) {
								llave = items[i].getId();
								sap.ui.getCore().byId("idAfectacionIGV").setSelectedItemId(llave);
								i = items.length;
							}
						}
					}

					// sap.ui.getCore().byId("idneto").setValue(object.clistItemDetalleFacturaValortotalNetoXItem);
					// sap.ui.getCore().byId("idCantidad").setValue(object.clistItemDetalleFacturaCantidad);
					// sap.ui.getCore().byId("idDescuento").setValue(object.clistItemDetalleFacturaTotDescuento);
					// sap.ui.getCore().byId("idValorReferencial").setValue(object.clistItemDetalleFacturaValorReferencial);
					var llave = sap.ui.getCore().byId("idAfectacionIGV").getSelectedItem();
					if (llave !== null && llave !== undefined) {
						llave = llave.getKey();
						if (llave === "si") {
							sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://paid-leave");
							sap.ui.getCore().byId("idLabelIGV").setText("CON IGV");
						} else {
							sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://unpaid-leave");
							sap.ui.getCore().byId("idLabelIGV").setText("SIN IGV");
						}
					} else {
						sap.ui.getCore().byId("idIconUpdate02").setSrc("sap-icon://paid");
						sap.ui.getCore().byId("idLabelIGV").setText("-Sin seleccionar-");
					}

					this.calcular();
					/*var selects = [
						sap.ui.getCore().byId("idAfectacionIGV")
					];
					var firstItem;
					jQuery.each(selects, function (i, select) {
						select.getBinding("items").refresh(true);
						firstItem = select.getItems()[0];
						select.setSelectedItem(firstItem, true);
					});
					if (objeto.moneda !== "") {
						sap.ui.getCore().byId("idAfectacionIGV").setSelectedKey(objeto.moneda);
					}*/
				}.bind(this)
			});
			oDialogInsOrdenIngreso.open();
		},
		_onRouteMatched: function () {

			var oView = this.getView();
			var oModel = oView.getModel("myParam");
			oView.setModel(oModel);
			var usuarioRuc = oModel.getProperty("/usuarioRuc");
			var usuarioRucDes = oModel.getProperty("/usuarioRucDes");
			var usuarioLogin = oModel.getProperty("/usuarioLogin");
			this.getView().byId("idNumeroRuc").setValue(usuarioLogin);
			this.getView().byId("idNumeroRuc2").setValue(usuarioRuc);
			this.getView().byId("idRazSocial2").setValue(usuarioRucDes);
			this.getView().byId("idTotalDescuentos").setValue("     ");
			this.getView().byId("idTotalIGV").setValue("     ");
			this.getView().byId("idImporteTotal").setValue("     ");

			this.getView().byId("idValidacionFacySunat1").setText("Estado del contribuyente a la fecha de emisión : SIN ASIGNAR.");
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

			this.getView().byId("idFacturar").setEnabled(false);
			this.getView().byId("idValidacionFacAsig").setText("Sin items a asignar");
			this.getView().byId("idValidacionFacAsig").setType("Information");
			this.getView().byId("idErrores").setVisible(false);
			var varUsuario = oModel.getProperty("/usuarioLogin");
			var varRUC = oModel.getProperty("/usuarioRuc");
			var filterOrdenCompra = [];
			var filter;
			filter = new sap.ui.model.Filter("US_RUC", sap.ui.model.FilterOperator.EQ, varUsuario);
			filterOrdenCompra.push(filter);
			filter = new sap.ui.model.Filter("EM_RUC", sap.ui.model.FilterOperator.EQ, varRUC);
			filterOrdenCompra.push(filter);
			var url = "/odatabnv/odata2.svc/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			oModelJson.read("/T_OC_DETs?$format=json", {
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
				}.bind(this)
			});

			var date = new Date();
			this.getView().byId("idFacturaNumbre").setValue("");
			this.getView().byId("idFecEmision").setDateValue(date);
			this.getView().byId("idRazSocial").setValue("");
			this.getView().byId("idNomComercial").setValue("");
			this.getView().byId("idMoneda").setValue("");
			this.getView().byId("idTasaIGV").setValue("");
			this.getView().byId("idPorcentajeDesGlo").setValue("");
			// Borrar seleccion checks de las tablas

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
		btnInicio: function () {
			var canContinue = false;
			var inputs = [
				this.getView().byId("idFacturaNumbre"),
				this.getView().byId("idVersionUBL"),
				this.getView().byId("idRazSocial"),
				this.getView().byId("idNomComercial"),
				this.getView().byId("idNumeroRuc"),
				this.getView().byId("idNumeroRuc2"),
				this.getView().byId("idRazSocial2"),
				this.getView().byId("idMoneda"),
				this.getView().byId("idTasaIGV"),
				this.getView().byId("idPorcentajeDesGlo")
			];
			jQuery.each(inputs, function (i, input) {
				if (input.getValue() !== "") {
					input.setValueState("None");
					canContinue = true;
				} else {
					input.setValueState("None");
				}
			});
			var lenghtDetalleFactura = this.getView().getModel("myParam").getProperty("/listItemDetalleFactura/length");
			if (canContinue || lenghtDetalleFactura > 0) {
				var dialogMensaje = new sap.m.Dialog({
					draggable: true,
					resizable: true,
					contentWidth: "370px",
					title: "Mensaje de confirmación",
					content: [
						new sap.m.Label({
							text: "¿Está seguro de volver al menú principal?",
							wrapping: true,
							design: "Bold",
							width: "100%"
						}),
						new sap.m.Label({
							text: "Los datos ingresados en la cabecera y en el detalle de la factura serán eliminados.",
							wrapping: true,
							width: "100%"
						})
					],
					state: "Warning",
					type: "Message",
					beginButton: new sap.m.Button({
						press: function () {
							dialogMensaje.close();
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
			} else {
				this.getRouter().navTo("Vista_Menu_Principal");
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
		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);
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
			llaveSeleccionada.COD = oModel.getProperty(valObject + "/clistItemDetalleFacturaCodigo");
			llaveSeleccionada.MATERIAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaDescripcion");
			var netoxItem = parseFloat(oModel.getProperty(valObject + "/clistItemDetalleFacturaPreUnixItem")).toFixed(2);
			llaveSeleccionada.NETO = netoxItem;
			llaveSeleccionada.ORDEN_COMPRA = oModel.getProperty(valObject + "/clistItemsOrdenCompra");

			llaveSeleccionada.TOTAL = oModel.getProperty(valObject + "/clistItemDetalleFacturaTotal");
			var listaValesIngreso = oModel.getProperty("/listaValesIngreso");
			var listaValesIngresoSalvado = listaValesIngreso;
			var total = 0;
			var selectedItem = this.getView().byId("idComboTipo").getSelectedItem();
			var llaveTipo = selectedItem.getKey();
			var vectorEliminar = [];
			var realizar = true;
			for (var k = 0; k < listaValesIngreso.length; k++) {
				realizar = true;
				for (var l = 0; l < listItemDetalleFactura.length; l++) {

					if (listItemDetalleFactura[l].clistItemDetalleFacturaPosicion !== llaveSeleccionada.POS) {
						for (var m = 0; m < listItemDetalleFactura[l].clistItemsOrdenCompra.length; m++) {
							var ordenCompraSelect = listItemDetalleFactura[l].clistItemsOrdenCompra[m];
							if (listaValesIngreso[k].DE_POSICION === ordenCompraSelect.DE_POSICION &&
								listaValesIngreso[k].DE_NUMERO_ORDEN === ordenCompraSelect.DE_NUMERO_ORDEN) {
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
					vectorEliminar.push(listaValesIngreso[k]);
				}
			}

			listaValesIngreso = vectorEliminar;

			for (var j = 0; j < listaValesIngreso.length; j++) {
				listaValesIngreso[j].selectItem = false;
			}
			for (var i = 0; i < llaveSeleccionada.ORDEN_COMPRA.length; i++) {
				total += parseFloat(llaveSeleccionada.ORDEN_COMPRA[i].DE_TOTAL.toString().replace(',', '.'));
				for (var j = 0; j < listaValesIngreso.length; j++) {
					if (listaValesIngreso[j].DE_POSICION === llaveSeleccionada.ORDEN_COMPRA[i].DE_POSICION &&
						listaValesIngreso[j].DE_NUMERO_ORDEN === llaveSeleccionada.ORDEN_COMPRA[i].DE_NUMERO_ORDEN) {
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
						var posicion = objeto.DE_POSICION;
						var ordenCompra = objeto.DE_NUMERO_ORDEN;
						var listaValesIngreso = oModel.getProperty("/listaValesIngreso");
						var vectorVerificacion = [];
						var realizar = true;
						var motivo = "";
						for (var v = 0; v < listaValesIngreso.length; v++) {
							if (listaValesIngreso[v].selectItem) {
								if (listaValesIngreso[v].DE_NUMERO_ORDEN === ordenCompra) {
									if (listaValesIngreso[v].DE_POSICION === posicion) {
										vectorVerificacion.push(listaValesIngreso[v]);
									} else {
										realizar = false;
										motivo = "No se puede asignar dos Posiciones distintas.";
										v = listaValesIngreso.length;
									}
								} else {
									realizar = false;
									motivo = "No se puede asignar dos Ordenes de compra distintas.";
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
									totalVale += parseFloat(listaValesIngreso[v].DE_TOTAL.toString().replace(',', '.'));
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
					text: "Fecha Ingreso"
				}),
				template: new sap.m.Text({
					text: "{DE_FEC_REGISTRO}"
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
										text: "N° de Documento ingreso",
										valueState: "Warning"
									}),
									new sap.m.Input({
										maxLength: 10,
										id: "idNroVale",
										valueStateText: "El campo N° de Documento ingreso no debe estar vacío.",
										placeholder: "Ingrese N° de Documento ingreso (10)...",
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
														filter = new sap.ui.model.Filter("DE_DOC_MATERIAL", sap.ui.model.FilterOperator.Contains, valor);
														aFilters.push(filter);
													} else {
														filter = new sap.ui.model.Filter("DE_HOJA_ENTRADA", sap.ui.model.FilterOperator.Contains, valor);
														aFilters.push(filter);
													}
												} else if (idCampo === "idGuia") {
													filter = new sap.ui.model.Filter("DE_GUIA_REMISION", sap.ui.model.FilterOperator.Contains, valor);
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
										sap.ui.getCore().byId("idGuia")
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
						for (var v = 0; v < listaValesIngreso.length; v++) {
							if (listaValesIngreso[v].selectItem) {
								vector.push(listaValesIngreso[v]);
							}
						}
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
					}.bind(this),
					text: "Aceptar"
				}),
				endButton: new sap.m.Button({
					press: function () {
						dialogMensaje.close();
						if (llave === "S") {
							this.getView().byId("idComboTipo").setSelectedKey("H");
						} else {
							this.getView().byId("idComboTipo").setSelectedKey("S");
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
		pressValidarSunat: function () {
			var canContinue = true;
			var inputs = [
				this.getView().byId("idFacturaNumbre"),
				this.getView().byId("idVersionUBL"),
				this.getView().byId("idFecEmision"),
				this.getView().byId("idRazSocial"),
				this.getView().byId("idNomComercial"),
				this.getView().byId("idNumeroRuc"),
				this.getView().byId("idNumeroRuc2"),
				this.getView().byId("idRazSocial2"),
				this.getView().byId("idMoneda")
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
					}.bind(this)
				});
			} else {
				var dialog = new sap.m.Dialog({
					title: "Alerta",
					type: "Message",
					state: "Warning",
					content: new sap.m.Text({
						text: "Se requiere seleccionar/ingresar todos los campos del formulario factura."

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
		oDialogOrdenDeCompra: function (varPosicionFactura, varCodigoFactura, varValortotalNetoFactura, varDescripcionFactura,
			pathFacturaItem) {

			// Llamar modelo
			var url = "/odatabnv/odata2.svc/";
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
					oModelxd.read("/T_OC_DETs?$format=json", {
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
										title: "IGV"
									})
								],
								firstStatus: new sap.m.ObjectStatus({
									id: "idStatusOC2",
									state: "None"
								}),
								secondStatus: new sap.m.ObjectStatus({
									id: "idStatusOC1"
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

					oModelxd.read("/T_OCs?$format=json", {
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
			var url = "/odatabnv/odata2.svc/";
			var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
			var matrixEnProceso = [];
			var registroEnProceso = {};

			//Filtros
			var filterOrdenCompra = [];
			var filter;
			filter = new sap.ui.model.Filter("DE_NUMERO_ORDEN", sap.ui.model.FilterOperator.EQ, vlistOrdenCompraNum);
			filterOrdenCompra.push(filter);

			oModelJson.read("/T_OC_DETs?$format=json", {
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
		subTotalOrdenCompra: function (contenido) {
			var myParam = this.getView().getModel("myParam");
			var total = 0;
			var valorNeto = parseFloat(myParam.getProperty(this.posFacturaGlobal + "/clistItemDetalleFacturaPreUnixItem")).toFixed(2);
			var valorNetoMas5 = parseFloat(valorNeto) + 0.05;
			valorNetoMas5 = valorNetoMas5.toFixed(2);
			var valorNetoMenos5 = parseFloat(valorNeto) - 0.05;
			valorNetoMenos5 = valorNetoMenos5.toFixed(2);

			for (var i = 0; i < contenido.length; i++) {
				var valorIngreso = contenido[i].DE_TOTAL;
				if (valorIngreso === null || valorIngreso === undefined || valorIngreso === "") {
					valorIngreso = "0";
				}
				total += parseFloat(valorIngreso.toString().replace(',', '.'));
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
			if (sap.ui.getCore().byId("idTableTotal") !== undefined && sap.ui.getCore().byId("idTableTotal") !== null) {
				sap.ui.getCore().byId("idTableTotal").getBinding("rows").refresh(true);
			}
			this.verificarAsignaciónPosFactura();
		},
		verificarAsignaciónPosFactura: function () {
			var myParam = this.getView().getModel("myParam");
			var listaItem = myParam.getProperty("/listItemDetalleFactura");

			var asignado = true;
			for (var i = 0; i < listaItem.length; i++) {
				if (listaItem[i].clistItemDetalleFacturaEstado !== "Asignado") {
					asignado = false;
				}
			}
			if (listaItem.length !== 0) {
				if (asignado) {
					this.getView().byId("idValidacionFacAsig").setText("Todos los items de la factura asignadas.");
					this.getView().byId("idValidacionFacAsig").setType("Success");
					this.getView().byId("idFacturar").setEnabled(true);
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
		btnFacturar: function () {
			this.getView().setBusy(true);

			var url = "/odatabnv/odata2.svc/";
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

			var model = this.getView().getModel("myParam");
			model.setProperty("/listErrores", []);
			var paginaCard = model.getProperty("/pages/0");
			filter = new sap.ui.model.Filter("ID_FACTURA", sap.ui.model.FilterOperator.EQ, paginaCard.description);
			filters.push(filter);

			oModel.read("/T_FACs?$format=json", {
				filters: filters,
				success: function (response) {
					var oModelJSON = new sap.ui.model.json.JSONModel(response.results);
					var lenghtV = oModelJSON.getData().length;
					if (lenghtV === 0) {
						var cabecera = model.getProperty("/listItemCabeceraFactura");
						var usuario = model.getProperty("/usuarioLogin");
						var rucUser = model.getProperty("/usuarioRuc");

						var SOHeader = {};
						SOHeader.EM_RUC = rucUser;
						SOHeader.US_RUC = rucUser;
						SOHeader.ID_FACTURA = this.getView().byId("idFacturaNumbre").getValue();

						SOHeader.UBL = this.getView().byId("idVersionUBL").getValue();
						SOHeader.FC_FEC_EMISION = this.getView().byId("idFecEmision").getValue();
						SOHeader.NOM_DEM_RAZ = this.getView().byId("idRazSocial").getValue();
						SOHeader.NOM_COMERCIAL = this.getView().byId("idNomComercial").getValue();
						//		SOHeader.RUC = cabecera[4].value.trim();
						SOHeader.TIPO_DOC = "01";
						SOHeader.RUC_ADQ = this.getView().byId("idNumeroRuc2").getValue();
						SOHeader.NOM_DEM_RAZ_ADQ = this.getView().byId("idRazSocial2").getValue();
						SOHeader.MONEDA = this.getView().byId("idMoneda").getValue();
						SOHeader.TASA_IGV = this.getView().byId("idTasaIGV").getValue();
						SOHeader.TOTAL_DESC = totalDesc.trim();
						SOHeader.TOTAL_IGV = totalIGV.trim();
						SOHeader.TOTAL_IMP = totalImp.trim();

						SOHeader.FC_FEC_REGISTRO = date;
						SOHeader.FC_HORA_REGISTRO = time;
						SOHeader.FC_USER_REGISTRO = usuario;
						SOHeader.ESTADO = "P";
						SOHeader.FEC_JOB = "";
						oModel.create("/T_FACs", SOHeader, {
							method: "POST",
							success: function (data) {
								this.obtenerExitoOdata("Factura " + data.ID_FACTURA, "Se registró con éxito la factura " + data.ID_FACTURA + ".");

								var listItemDetalleFactura = model.getProperty("/listItemDetalleFactura");
								var llavePos = {};
								var llaveItem = {};
								for (var a = 0; a < listItemDetalleFactura.length; a++) {
									llavePos = {};
									llavePos.EM_RUC = rucUser;
									llavePos.US_RUC = rucUser;
									llavePos.ID_FACTURA = this.getView().byId("idFacturaNumbre").getValue();
									llavePos.POS_FACTURA = listItemDetalleFactura[a].clistItemDetalleFacturaPosicion;
									llavePos.PRECIO_NETO = listItemDetalleFactura[a].clistItemDetalleFacturaValortotalNetoXItem;
									llavePos.CODIGO = listItemDetalleFactura[a].clistItemDetalleFacturaCodigo;
									llavePos.DESCRIPCION = listItemDetalleFactura[a].clistItemDetalleFacturaDescripcion;
									llavePos.UND_MED = listItemDetalleFactura[a].clistItemDetalleFacturaUniMedida;

									llavePos.CANTIDAD = listItemDetalleFactura[a].clistItemDetalleFacturaCantidad;
									llavePos.PRE_UNI = listItemDetalleFactura[a].clistItemDetalleFacturaPreUnixItem;
									llavePos.PRE_VENTA = listItemDetalleFactura[a].clistItemDetalleFacturaPreVenxItem;
									var itemsOC = listItemDetalleFactura[a].clistItemsOrdenCompra;
									for (var b = 0; b < itemsOC.length; b++) {
										llaveItem = {};
										llaveItem.EM_RUC = rucUser;
										llaveItem.US_RUC = rucUser;
										llaveItem.ID_FACTURA = this.getView().byId("idFacturaNumbre").getValue();
										llaveItem.POS_FACTURA = listItemDetalleFactura[a].clistItemDetalleFacturaPosicion;
										llaveItem.OC_NUMERO_ORDEN = itemsOC[b].ordenCompra;
										llaveItem.DE_POSICION = itemsOC[b].clistItemFiltroEnProcesoPosicion;
										llaveItem.PRECIO_ING = itemsOC[b].clistItemFiltroEnProcesoValorIngresar;
										llaveItem.CODIGO = "";
										llaveItem.DESCRIPCION = itemsOC[b].clistItemFiltroEnProcesoDescripcion;
										llaveItem.UND_MED = itemsOC[b].clistItemFiltroEnProcesoMoneda;
										llaveItem.CANTIDAD = itemsOC[b].clistItemFiltroEnProcesoCantidad;
										llaveItem.PRE_UNI = "";
										llaveItem.PRE_VENTA = "";
										oModel.create("/T_FAC_POSs", llaveItem, {
											method: "POST",
											success: function (data) {
												this.obtenerExitoOdata("Factura " + data.ID_FACTURA + ", posición " + data.DE_POSICION + ", OC " + data.OC_NUMERO_ORDEN,
													"Se registró con éxito la posición OC" + data.DE_POSICION + " - " + data.OC_NUMERO_ORDEN + " .");
											}.bind(this),
											error: function (data) {
												this.obtenerErrorOdata(data, "Error al registrar en T_FAC_POS",
													"No se pudo registrar una posición OC de la factura " + paginaCard.description + ".");
											}.bind(this)
										});
									}
									oModel.create("/T_FAC_DETs", llavePos, {
										method: "POST",
										success: function (data) {
											this.obtenerExitoOdata("Factura " + data.ID_FACTURA + ", item " + data.POS_FACTURA,
												"Se registró con éxito el item de la factura " + data.POS_FACTURA + " - " + data.ID_FACTURA + " .");
										}.bind(this),
										error: function (data) {
											this.obtenerErrorOdata(data, "Error al registrar en T_FAC_DET", "No se pudo registrar un item de la factura " +
												paginaCard.description + ".");
										}.bind(this)
									});
								}

								this.getView().setBusy(false);
							}.bind(this),
							error: function (data) {
								this.obtenerErrorOdata(data, "Error al registrar en T_FAC", "No se pudo registrar la factura " + paginaCard.description +
									".");
								this.getView().setBusy(false);
							}.bind(this)
						});
						this.getView().byId("idErrores").setVisible(true);

						this.btnErrores();
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
					var dialog = new sap.m.Dialog({
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
					dialog.open();
				}.bind(this)
			});

		}
	});

});