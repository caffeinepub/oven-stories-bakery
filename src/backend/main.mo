import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";

actor {
  type Category = {
    #cakes;
    #breads;
    #cookies;
    #pastries;
  };

  type MenuItem = {
    name : Text;
    description : Text;
    priceInr : Nat;
    category : Category;
    isFeatured : Bool;
  };

  type Inquiry = {
    name : Text;
    phone : Text;
    message : Text;
    timestamp : Int;
  };

  module MenuItem {
    public func compareByPrice(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Int.compare(item1.priceInr, item2.priceInr);
    };
  };

  let menu = Map.empty<Text, MenuItem>();
  let inquiries = Map.empty<Int, Inquiry>();

  public shared ({ caller }) func seedMenu() : async () {
    menu.add(
      "Chocolate Cake",
      {
        name = "Chocolate Cake";
        description = "Rich chocolate cake with ganache frosting";
        priceInr = 500;
        category = #cakes;
        isFeatured = true;
      },
    );
    menu.add(
      "Sourdough Bread",
      {
        name = "Sourdough Bread";
        description = "Artisan sourdough with a crispy crust";
        priceInr = 150;
        category = #breads;
        isFeatured = false;
      },
    );
    menu.add(
      "Oatmeal Cookies",
      {
        name = "Oatmeal Cookies";
        description = "Chewy cookies with oats and raisins";
        priceInr = 200;
        category = #cookies;
        isFeatured = true;
      },
    );
  };

  public query ({ caller }) func getMenu() : async [MenuItem] {
    menu.values().toArray();
  };

  public query ({ caller }) func getMenuByPrice() : async [MenuItem] {
    menu.values().toArray().sort(MenuItem.compareByPrice);
  };

  public shared ({ caller }) func submitInquiry(name : Text, phone : Text, message : Text) : async () {
    let timestamp = Time.now();
    let inquiry : Inquiry = {
      name;
      phone;
      message;
      timestamp;
    };
    inquiries.add(timestamp, inquiry);
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    inquiries.values().toArray();
  };
};
