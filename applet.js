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

        // Emoji grid
        let emojis = ["😀", "😂", "😍", "👍", "🎉", "🔥", "❤️", "😎", "🥳", "🤔", "😭", "😡"];

        // A container for our grid
        let grid = new St.BoxLayout({ vertical: true });

        let row;
        emojis.forEach((e, i) => {
            if (i % 4 === 0) {  // every 4 emojis, start a new row
                row = new St.BoxLayout({ vertical: false });
                grid.add(row);
            }

            let button = new St.Button({ label: e, style_class: "emoji-button" });
            button.connect('clicked', () => {
                Clipboard.set_text(CLIPBOARD_TYPE, e);
            });

            row.add(button);
        });

        // Add grid to menu
        let gridItem = new PopupMenu.PopupBaseMenuItem({ reactive: false });
        //gridItem.actor.add(grid);
        gridItem.add_child(grid)
        this.menu.addMenuItem(gridItem);

    },

    on_applet_clicked: function() {
        this.menu.toggle();
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new EmojiPickerApplet(metadata, orientation, panel_height, instance_id);
}
