#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::{Menu, MenuItem, Submenu};



fn main() {
  let app = Submenu::new(
    "Octii".to_string(),
    Menu::new()
      .add_native_item(MenuItem::About("Octii".to_string()))
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Hide)
      .add_native_item(MenuItem::HideOthers)
      .add_native_item(MenuItem::ShowAll)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Quit)
  );

  let view = Submenu::new(
    "View".to_string(),
    Menu::new()
      .add_native_item(MenuItem::EnterFullScreen)
  );

  let menu = Menu::new().add_submenu(app).add_submenu(view);

  tauri::Builder::default()
    .menu(menu)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
