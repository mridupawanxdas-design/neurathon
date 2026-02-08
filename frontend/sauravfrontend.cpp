#include <iostream>
#include <vector>
#include <string>

// --- MOCK UI LIBRARY (Replace with ImGui + WebAssembly for final) ---
namespace BizAgentUI {
    struct Color { float r, g, b, a; };
    
    // Setting the "Indian Theme" Palette as per competition requirements
    const Color COTTON_WHITE = {0.98f, 0.96f, 0.93f, 1.0f};
    const Color MARIGOLD     = {1.00f, 0.60f, 0.20f, 1.0f}; // Warm Indian Orange
    const Color INDIGO_BLUE  = {0.26f, 0.30f, 0.58f, 1.0f}; // Deep Professional Blue
    
    void DrawHeader(std::string title) {
        std::cout << "\n--- [ " << title << " ] ---" << std::endl;
        std::cout << "Theme: Indigo & Marigold | Status: Connected" << std::endl;
    }
}

// Data Structure for Inventory
struct Product {
    std::string name;
    int stock;
    double price;
};

// Main Application Class
class BharatBizDashboard {
private:
    std::vector<Product> inventory;
    std::vector<std::string> recentActivity;

public:
    BharatBizDashboard() {
        // Sample data for the Indian context
        inventory.push_back({"Basmati Rice", 50, 110.0});
        inventory.push_back({"Mustard Oil", 12, 180.0}); // Low stock alert
        recentActivity.push_back("System: Waiting for WhatsApp orders...");
    }

    void Render() {
        BizAgentUI::DrawHeader("BHARAT BIZ-AGENT | DASHBOARD");

        // 1. AI AGENT LIVE FEED (Action-Oriented Feed)
        std::cout << "\n[AI Agent Activity (Hinglish Support)]" << std::endl;
        for (const auto& log : recentActivity) {
            std::cout << "> " << log << std::endl;
        }

        // 2. HUMAN-IN-THE-LOOP (Safety Requirement) [Cite: 107]
        std::cout << "\n[Action Required: Naya Order Aaya Hai]" << std::endl;
        std::cout << "Agent drafted: 'Bill to Rahul for 500 Rs'. Confirm? (H/N): ";
        
        // 3. INVENTORY STATUS (Lightweight Table) [Cite: 110]
        std::cout << "\n[Inventory (Maal Check)]" << std::endl;
        std::cout << "Item Name\tStock\tPrice (INR)" << std::endl;
        std::cout << "------------------------------------------" << std::endl;
        for (const auto& item : inventory) {
            std::cout << item.name << "\t" << item.stock;
            if (item.stock < 15) std::cout << " [LOW STOCK!]";
            std::cout << "\t" << item.price << std::endl;
        }
    }
    
    // Voice-First Trigger Placeholder [Cite: 112, 113]
    void OnVoiceCommand(std::string command) {
        std::cout << "Processing Voice: " << command << "..." << std::endl;
    }
};

int main() {
    BharatBizDashboard app;
    app.Render();
    return 0;
} 
