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

        // Emoji grid (replace your old list code with this)
        let emojis = ["😀","😂","😍","👍","🎉","🔥","❤️","😎","🥳","🤔","😭","😡"];
        
        const COLS = 4;
        
        // Build the grid (rows of buttons)
        let grid = new St.BoxLayout({ vertical: true });
        
        // helper to be compatible with different Cinnamon versions
        function addTo(container, child) {
            if (container.add_child) container.add_child(child);
            else if (container.add_actor) container.add_actor(child);
            else container.set_child?.(child); // fallback for bins
        }
        
        let row = null;
        emojis.forEach((e, i) => {
            if (i % COLS === 0) {
                row = new St.BoxLayout({ vertical: false });
                addTo(grid, row);
            }

            let button = new St.Button({ label: e, style_class: "emoji-button", can_focus: true });
            button.connect('clicked', () => {
                Clipboard.set_text(CLIPBOARD_TYPE, e);
                this.menu.close();   // 👈 closes the menu right after clicking
            });

            addTo(row, button);
        });

        // Put the grid into the menu
        let section = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(section);
        addTo(section.actor, grid);
    },

    on_applet_clicked: function() {
        this.menu.toggle();
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new EmojiPickerApplet(metadata, orientation, panel_height, instance_id);
}
