/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"nspprov/ui5apppprov/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
