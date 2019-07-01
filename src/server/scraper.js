const puppeteer = require("puppeteer");

module.exports = async credentials => {
    if (!credentials.agency || !credentials.account || !credentials.password) {
        return { error: "Missing information" };
    }

    //
    // Configurações
    //
    const browser = await puppeteer.launch({
        headless: true,
        devtools: true
    });

    const page = await browser.newPage();

    await page.goto("https://www.itau.com.br/index.html");

    //
    // 1
    // Agencia e Conta
    //
    try {
        await page.waitForSelector("#campo_agencia");
    } catch (e) {
        if (e instanceof puppeteer.errors.TimeoutError) {
            // Do something if this is a timeout.
        }
    }

    await page.type("#campo_agencia", credentials.agency);
    await page.type("#campo_conta", credentials.account);

    //
    // 2
    // Digitar senha e clicar para submitar
    //
    try {
        try {
            await Promise.all([
                page.waitForSelector("#senha"),
                page.click(".btnSubmit")
            ]);
        } catch (error) {
            await browser.close();

            return { error: "Something is wrong with agency and account" };
        }

        const keys = await page.evaluate(resultsSelector => {
            const anchors = Array.from(
                document.querySelectorAll(resultsSelector)
            );

            return anchors.map(anchor => {
                return anchor.textContent.trim();
            });
        }, "a.campoTeclado");

        const getKeyText = digit => {
            return keys.filter(key => {
                return key.indexOf(digit) != -1;
            });
        };

        const arrPassword = Array.from(credentials.password);

        //
        // Loop para clicar nas teclas de senha
        // No banco Itaú não é inserido direto do teclado a senha
        // É necessario usar o mouse e clicar nas teclas do homebanking
        // E é isso que esse trecho de código abaixo faz
        //
        for (let index = 0; index < arrPassword.length; index++) {
            const digit = arrPassword[index];
            await page.$eval(`[aria-label='${getKeyText(digit)}']`, btn =>
                btn.click()
            );
        }
    } catch (e) {
        if (e instanceof puppeteer.errors.TimeoutError) {
            // Do something if this is a timeout.
        }
    }

    //
    // Click para extrato completo
    try {
        await Promise.all([
            page.waitForSelector(
                "#exibirBoxContaCorrente .botoes a.itau-button"
            ),
            page.$eval("#acessar", btn => btn.click())
        ]);
    } catch (e) {
        if (e instanceof puppeteer.errors.TimeoutError) {
            // Do something if this is a timeout.
        }
    }

    //
    // Seta o filtro para extratos dos últimos 90 dias
    //
    try {
        await Promise.all([
            page.waitForSelector("#select-filtrarPeriodo select"),
            page.$eval("#exibirBoxContaCorrente .botoes a.itau-button", btn =>
                btn.click()
            )
        ]);
    } catch (e) {
        if (e instanceof puppeteer.errors.TimeoutError) {
            // Do something if this is a timeout.
        }
    }

    await page.select("#select-filtrarPeriodo select", "90");

    //
    // Retorna tabela de extratos
    //
    try {
        await page.waitForSelector("#gridLancamentos-pessoa-fisica");
    } catch (e) {
        if (e instanceof puppeteer.errors.TimeoutError) {
            // Do something if this is a timeout.
        }
    }

    const extractTable = await page.evaluate(() => {
        const rows = Array.from(
            document.querySelectorAll(
                "#gridLancamentos-pessoa-fisica tbody tr.linha-impressao"
            )
        );

        let balance = document.querySelector(
            "#conteudo-saldo-resumido span:not(#titulo-box-saldo)"
        ).innerText;

        balance = balance.replace("R$ ", "");

        const extract = rows.map(row => {
            let date = row.querySelector(
                "td:first-child span.element--accessHide"
            ).innerText;

            let description = row
                .querySelector("td:nth-child(2) > span")
                .innerText.trim();

            let value =
                row.querySelector("td:nth-child(3) span.element--accessHide") ||
                row.querySelector("td:nth-child(3)");

            value = value.innerText;

            return {
                date,
                description,
                value
            };
        });

        return {
            extract,
            balance
        };
    });

    await browser.close();

    return extractTable;
};
