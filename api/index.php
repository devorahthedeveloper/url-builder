<?php
require 'vendor/autoload.php';
require 'helpers.php';

/* Set up Database
------------------------------------ */

use Flintstone\Flintstone;
use Flintstone\Formatter\JsonFormatter;

// Set options
$db_dir = 'db/';
$db_options = array(
	'dir' => $db_dir,
	'formatter' => new JsonFormatter()
);

// Load the databases
$db = array();
$db['params'] = Flintstone::load('params', $db_options);
$db['props'] = Flintstone::load('props', $db_options);

// Seed the database
// seedDatabases($db['params'], $db['props']);

/* Endpoints
------------------------------------

/api/params/
/api/params/country/
/api/props/
/api/props/protocol/

*/


/* Instantiate Slim
------------------------------------ */

$app = new \Slim\Slim(array(
   'debug' => true
));

// Set conditions for all routes - only listen for specific resources
\Slim\Route::setDefaultConditions(array(
 'resource' => 'params|props'
));


/* ROUTES
------------------------------------ */

// Home Route
$app->get('/', function() use($app) {
    $app->response->setStatus(200);
});

// GET Routes
$app->get('/:resource/', function ($resource) use($app, $db) {

	$resBody = json_encode( $db[$resource]->getAll() );
	$app->response->headers->set('Content-Type', 'application/json');
	$app->response->setBody( $resBody );

});


$app->get('/:resource/:item/', function ($resource, $item) use($app, $db) {

	$toGet = $db[$resource]->get($item);

	if ($toGet) {
		$app->response->headers->set('Content-Type', 'application/json');
		$app->response->setBody( $resBody = json_encode( $toGet ) );
	} else {
		$app->response->setStatus(400);
	}

});


$app->post('/:resource/:item/', function ($resource, $item) use($app, $db) {

	// add or update the item
	$data = json_decode( $app->request->getBody() );
	$dataIsGood = is_array($data) && !empty($data);

	if ($dataIsGood) {
		$db[$resource]->set($item, $data);
	} else {
		$app->response->setStatus(400);
	}

});

$app->delete('/:resource/:item/', function ($resource, $item) use($app, $db) {

	$toDelete = $db[$resource]->get($item);

	if ($toDelete) {
		$resBody = $db[$resource]->delete($item);
		$app->response->setBody($resBody);
	} else {
		$app->response->setStatus(400);
	}

});

// Catchall route
$app->get('.*', function () use($app) {
	$app->response->setStatus(404);
});


$app->run();

 ?>
