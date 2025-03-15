import User from "../models/userModel.js";

//
// Route to get all clients
const allClients = async (req, res) => {
  const { id } = req.params;
  const caId = id;
  try {
    // Fetch all clients
    const ca = await User.findById(caId).populate({
      path: "clients",
      select: "firstName lastName email isVerified",
      options: { sort: { _id: -1 } }, // Sort in descending order
    });
    if (!ca) {
      return res.status(404).json({ message: "CA not found" });
    }

    // Modify the response to include clientName
    const modifiedClients = ca.clients.map((client) => ({
      _id: client._id,
      clientName: `${client.firstName} ${client.lastName}`,
      email: client.email,
      isVerified: client.isVerified,
    }));

    res.status(200).json({ clients: modifiedClients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res
      .status(500)
      .json({ message: "Error fetching clients", error: error.message });
  }
};

export { allClients };
