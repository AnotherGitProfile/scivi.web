var lz = function(v) {
    return v < 10 ? "0" + v : v;
};
var d = new Date(SETTINGS_VAL["SETTING_NAME"]);
var s = lz(d.getHours()) + ":" + lz(d.getMinutes());
ADD_WIDGET("<div style='display: table-row;'><label style='display: table-cell; text-align: right;'>SETTING_NAME:&nbsp;</label><input type='time' step='any' value='" + s + "' id='s_SETTING_ID_" + NODE_ID +
           "' onchange='editor.changeSetting(\"SETTING_NAME\", \"s_SETTING_ID_" + NODE_ID + "\", " +
           NODE_ID + ");' style='display = table-cell; width: 100px;'/></div>");