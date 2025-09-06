// Defining a data model.
class Transaction {
  date string
  transaction_id string
  name string
  type string
  amount int
}

// Create a function to extract the resume from a string.
function ExtractTransactions(transaction: string) -> Transaction[] {
  // Specify a client as provider/model-name
  // you can use custom LLM params with a custom client name from clients.baml like "client CustomHaiku"
  client CustomAI // Set OPENAI_API_KEY to use this client.
  prompt #"
    You are a data extraction tool. Your sole purpose is to extract structured data from the given text.
    Do not generate any code, explanations, or any text other than the required JSON output.
    Your task is to analyze a PDF file that contains financial transactions.
    Always output the result in strict JSON format without any extra commentary.

    Rules

    Only accept PDF files.

    If the input is not a PDF, return:

    {
      "error": "Unsupported file type. Only PDF is allowed."
    }


    Validate PDF contents:

    If the PDF does not contain transactions, return:

    {
      "error": "Invalid file. No transactions found."
    }


    If valid, extract for each transaction:

    date → Date of transaction (YYYY-MM-DD if possible)

    transaction_id → Unique ID/reference number (string)

    name → Payee/Payer or description (string)

    type → "credit" or "debit"

    amount → Numeric value (no currency symbols, only number)

    Return an array of transaction objects directly.

    Here is an example of how to extract data from a markdown table:

    Input:
    | Date       | Transaction ID          | Name                     | Type   | Amount  |
    | ---------- | ----------------------- | ------------------------ | ------ | ------- |
    | 20-03-2024 | T4664425072181898970988 | JUSTVEND PRIVATE LIMITED | Credit | 1786.94 |
    | 10-05-2024 | T7072788910002864906183 | IRCTC                    | Credit | 1736.06 |

    Output:
    [
      {
        "date": "2024-03-20",
        "transaction_id": "T4664425072181898970988",
        "name": "JUSTVEND PRIVATE LIMITED",
        "type": "Credit",
        "amount": 1786
      },
      {
        "date": "2024-05-10",
        "transaction_id": "T7072788910002864906183",
        "name": "IRCTC",
        "type": "Credit",
        "amount": 1736
      }
    ]

    Now, extract the transactions from this markdown:
    {{ transaction }}

    Output Schema
    [
      {
        "date": "YYYY-MM-DD",
        "transaction_id": "string",
        "name": "string",
        "type": "credit | debit",
        "amount": number
      }
    ]


    The agent should never output anything except data in the form of the Output Schema (either the extracted structure or an error JSON).
    NOTE: Always ensure the output is valid Output schema no code direct value.

    {{ ctx.output_format }}
  "#
}



// // Test the function with a sample resume. Open the VSCode playground to run this.
// test vaibhav_resume {
//   functions [ExtractResume]
//   args {
//     resume #"
//       Vaibhav Gupta
//       vbv@boundaryml.com

//       Experience:
//       - Founder at BoundaryML
//       - CV Engineer at Google
//       - CV Engineer at Microsoft

//       Skills:
//       - Rust
//       - C++
//     "#
//   }
// }
