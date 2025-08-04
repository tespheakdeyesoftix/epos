package com.estccomputer.tsplprinter;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TsplPrinter")
public class TsplPrinterPlugin extends Plugin {

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void printTsplCommand(PluginCall call) {
        String command = call.getString("command");
        if (command == null) {
            call.reject("Must provide a TSPL command");
            return;
        }

        // TODO: Implement actual TSPL printing logic
        System.out.println("TSPL Command: " + command);

        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }
}