// Generated by CoffeeScript 1.12.7
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  gui.servicesPools.transports = function(servPool, info) {
    var transports, transportsTable;
    transports = new GuiElement(api.servicesPools.detail(servPool.id, "transports", {
      permission: servPool.permission
    }), "transports");
    transportsTable = transports.table({
      doNotLoadData: true,
      icon: 'transports',
      container: "transports-placeholder",
      doNotLoadData: true,
      rowSelect: "multi",
      buttons: ["new", "delete", "xls"],
      onNew: function(value, table, refreshFnc) {
        api.templates.get("pool_add_transport", function(tmpl) {
          api.transports.overview(function(data) {
            var i, j, len, modalId, ref, valid;
            gui.doLog("Data Received: ", servPool, data);
            valid = [];
            for (j = 0, len = data.length; j < len; j++) {
              i = data[j];
              if ((ref = i.protocol, indexOf.call(servPool.info.allowedProtocols, ref) >= 0)) {
                valid.push(i);
              }
            }
            modalId = gui.launchModal(gettext("Add transport"), api.templates.evaluate(tmpl, {
              transports: valid
            }));
            $(modalId + " .button-accept").on("click", function(event) {
              var transport;
              transport = $(modalId + " #id_transport_select").val();
              if (transport === -1) {
                gui.notify(gettext("You must provide a transport"), "danger");
              } else {
                transports.rest.create({
                  id: transport
                }, function(data) {
                  $(modalId).modal("hide");
                  refreshFnc();
                });
              }
            });
            gui.tools.applyCustoms(modalId);
          });
        });
      },
      onDelete: gui.methods.del(transports, gettext("Remove transport"), gettext("Transport removal error")),
      onData: function(data) {
        $.each(data, function(undefined_, value) {
          var style;
          style = "display:inline-block; background: url(data:image/png;base64," + value.type.icon + "); ; background-size: 16px 16px; background-repeat: no-repeat; width: 16px; height: 16px; vertical-align: middle;";
          value.trans_type = value.type.name;
          value.name = gui.fastLink("<span style=\"" + style + ("\"></span> " + value.name), value.id, 'gui.servicesPools.fastLink', 'goTransportLink');
        });
      }
    });
    return [transportsTable];
  };

}).call(this);
