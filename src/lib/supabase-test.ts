import { supabase } from "./supabase";

export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");

    // Test basic connection
    const { data, error } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Supabase connection failed:", error);
      return {
        success: false,
        error: error.message,
        details: error,
      };
    }

    console.log("✅ Supabase connection successful");
    console.log(`📊 Users table has ${data || 0} records`);

    return {
      success: true,
      userCount: data || 0,
    };
  } catch (error: any) {
    console.error("❌ Supabase connection test failed:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
      details: error,
    };
  }
};

export const checkDatabaseSchema = async () => {
  try {
    console.log("Checking database schema...");

    // Check if required tables exist
    const tables = ["users", "design_requests", "files", "chats", "messages"];
    const results: Record<string, any> = {};

    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });

        if (error) {
          results[table] = { exists: false, error: error.message };
          console.log(`❌ Table '${table}' not found:`, error.message);
        } else {
          results[table] = { exists: true };
          console.log(`✅ Table '${table}' exists`);
        }
      } catch (err: any) {
        results[table] = { exists: false, error: err.message };
        console.log(`❌ Error checking table '${table}':`, err.message);
      }
    }

    return results;
  } catch (error: any) {
    console.error("❌ Schema check failed:", error);
    return { error: error.message };
  }
};
