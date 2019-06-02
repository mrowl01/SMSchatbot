require('dotenv').config();
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const AssistantV1 = require('ibm-watson/assistant/v1');
const app = express();
const assistant = new AssistantV1({
  version: process.env.WATSON_VERSION,
  iam_apikey: process.env.API,
  url: process.env.WATSON_URL
});

// bodyParser config
const  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
//testing things

// Routes
app.get('/',(req,res) =>{
	res.send('it is working');
})

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  const message = req.body.Body;
  const to = req.body.To;
  const from = req.body.From;

  assistant.message({
		workspace_id: process.env.WATSON_WORKSPACE_ID,
	    input: {text: message}
	})
	.then(response => JSON.stringify(response.output.text[0]))
	.then(watsonReply => {
		twiml.message(watsonReply)
		res.writeHead(200, {'Content-Type': 'text/xml'});
  		res.end(twiml.toString());
	})
});



// app.post('/sms', (req,res) =>{
// 	sendMessage();
// })


async function sendMessage(){
	const twiml = new MessagingResponse();
	const res = await twiml.message('sup chris');
	const format = await res.writeHead(200,{'Content-Type': 'text/xml'});
	return format.end(twiml.toString());
}

async function Message(textMessage) {
	const send = await assistant.message({
		workspace_id: process.env.WATSON_WORKSPACE_ID,
	    input: {text: textMessage}
	})
	const res = await JSON.stringify(send.output.text[0],null,2);
	return res
}


// app.get('/send', send)

// app.post('/sms', (req, res) => {
//   const twiml = new MessagingResponse();

//   twiml.message('The Robots are coming! Head for the hills!');

//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.end(twiml.toString());
// });

// to send messages
// client.messages
//   .create({
//      body: 'Sup Chris, you programmed this',
//      from: '+16149169406',
//      to: '+16142860463'
//    })
//   .then(message => console.log(message.sid));


http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337 ');
});





