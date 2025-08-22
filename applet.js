const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Mainloop = imports.mainloop;
const Clipboard = St.Clipboard.get_default();
const CLIPBOARD_TYPE = St.ClipboardType.CLIPBOARD;

function EmojiPickerApplet(metadata, orientation, panel_height, instance_id) {
    this._init(metadata, orientation, panel_height, instance_id);
}

EmojiPickerApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(metadata, orientation, panel_height, instance_id) {
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);
        this.set_applet_icon_name("face-smile");
        this.set_applet_tooltip("Emoji Picker");

        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);

        // List of emojis
        let emojis = ["😀", "😂", "😍", "👍", "🎉", "🔥", "❤️"];

        emojis.forEach(e => {
            let item = new PopupMenu.PopupMenuItem(e);
            item.connect('activate', () => {
                Clipboard.set_text(CLIPBOARD_TYPE, e);
            });
            this.menu.addMenuItem(item);
        });
    },

    on_applet_clicked: function() {
        this.menu.toggle();
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new EmojiPickerApplet(metadata, orientation, panel_height, instance_id);
}
