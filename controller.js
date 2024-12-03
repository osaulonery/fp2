const db = require("./supabase");
const { sendEmail } = require("./emailservice");

const createKey = async (req, res) => {
  try {
    const { email } = req.body;

    // Valida se o e-mail foi enviado no body {"email": "saulonery@ymail.com"}
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { data, error } = await db
      .from("keys")
      .insert([{ email }])
      .select("*");

    if (error) {
      return res
        .status(500)
        .json({ error: "Failed to create key", details: error.message });
    }

    return res.status(201).json({
      message: "Key created successfully",
      key: data[0],
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

const createKeyAndSendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Criar a chave no banco de dados
    const { data, error } = await db
      .from("keys")
      .insert([{ email }])
      .select("*");

    if (error) {
      return res
        .status(500)
        .json({ error: "Failed to create key", details: error.message });
    }

    const createdKey = data[0]; // Chave criada

    // Enviar email com a chave
    const emailResult = await sendEmail(
      email,
      "Your activation key",
      `forPOE thanks you, here is your activation key: ${createdKey.id}! GL!`
    );

    if (!emailResult.success) {
      return res
        .status(500)
        .json({ error: "Failed to send email", details: emailResult.error });
    }

    return res.status(201).json({
      message: "Key created and email sent successfully",
      key: createdKey,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

const activateKey = async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "Key not provided." });
    }

    // Verifica se a chave existe no banco de dados
    const { data: keyData, error: fetchError } = await db
      .from("keys")
      .select("id, status")
      .eq("id", key)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: "Key not found." });
    }

    // Verifica se a chave já está ativa
    if (keyData.status === "ATIVA") {
      return res.status(400).json({ error: "Key already activated." });
    }

    const { error: updateError } = await db
      .from("keys")
      .update({
        status: "ATIVA",
      })
      .eq("id", key);

    if (updateError) {
      return res.status(500).json({ error: "Error activating the key." });
    }

    return res.status(200).json({ message: "Key activated successfully." });
  } catch (error) {
    console.error("Erro no activateKey:", error);
    return res.status(500).json({ error: "Unknown key status." });
  }
};

const verifyKey = async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ error: "Insert a key." });
    }

    // Verifica se a chave existe no banco de dados
    const { data: keyData, error: fetchError } = await db
      .from("keys")
      .select("status")
      .eq("id", key)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: "Key not found." });
    }

    if (keyData.status === "ATIVA") {
      return res.status(200).json({ valid: true });
    } else if (keyData.status === "INATIVA") {
      return res.status(200).json({ valid: false });
    } else {
      return res.status(400).json({ error: "Unknown key status." });
    }
  } catch (error) {
    console.error("Error on Key:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { createKey, createKeyAndSendEmail, activateKey, verifyKey };
