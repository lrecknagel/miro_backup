require('dotenv-flow').config();

const { writeFile } = require('fs/promises');
const sdk = require('api')('@miro-ea/v2.0#975oleiwgz0y');

async function fetchBoards() {
  sdk.auth(process.env.MIRO_BEARER)
  
  const boardsRes = await sdk.getBoards({sort: 'default'});
  const {
    total: totalBoards,
    size: currentSize,
    data: boards
  } = boardsRes.data;
  
  const iterations = Math.ceil(totalBoards / currentSize);
  let boardsData = [...boards];
  for (let i = 0; i < iterations; i++) {
    const _boardsRes = await sdk.getBoards({sort: 'default', offset: (i + 1) * currentSize});
    const { data: _boards } = _boardsRes.data;
    boardsData = [...boardsData, ..._boards];
  }

  const boardListings = boardsData.map(({ id, name }, idx) => ({ idx, id, name }));
  await writeFile(`${ process.cwd() }/boards.json`, JSON.stringify(boardListings, null, 2), 'utf8');
}
fetchBoards();