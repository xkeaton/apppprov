/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["nspprov/ui5apppprov/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
