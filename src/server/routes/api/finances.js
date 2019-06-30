const express = require("express");

const User = require("../../models/User");
const Finance = require("../../models/Finance");

const scraper = require("../../scraper");

const router = express.Router();

router.post("/", async (req, res) => {
    const { account } = req.body;

    try {
        // Busca se ja existe um usuario com essas credenciais
        let user = await User.findOne({ account });

        // Se não existe cria
        if (!user) user = await User.create(req.body);

        // Remove o ultimo extrato deste usuario
        await Finance.deleteMany({ user: user.id });

        // Scrpaer para pegar um novo extrato deste usuario
        const scraperResponse = await scraper(req.body);

        if (!scraperResponse.error) {
            // Cria novo extrato
            const finance = await Finance.create({
                ...scraperResponse,
                user: user.id
            });

            return res.send(finance);
        } else {
            return res.status(400).send(scraperResponse);
        }
    } catch (error) {
        return res.status(400).send({ error: "Something went wrong, try again" });
    }
});

module.exports = router;
