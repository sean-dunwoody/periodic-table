<pre>
	<?php

		ini_set('display_errors', 1);
		// This is currently just an example

		$user = 'root';
		$pass = '';
		try {
		    $dbh = new PDO('mysql:host=localhost;dbname=periodta_periodictable', $user, $pass);
		    $elements = $dbh->query("SELECT * FROM `elements`");
		    foreach($elements as $row) {

	    		$atomicNumber = $row['AtomicNumber'];
		    	$physicalProperties = array();
		    	foreach($dbh->query("SELECT * FROM `physical_properties`, `physical_property_type` WHERE `physical_properties`.`PAtomicNumber` = $atomicNumber AND `physical_properties`.`PropertyType` = `physical_property_type`.`TypeId`") as $row2) {
		    		$physicalProperties[] = array(
		    			"Property" => array($row2['PropertyName'], $row2['PropertyValue']),
		    			"PropertyType" => array($row2['TypeName'], $row2['TypeValue'])
		    		);
		    	}
	    		$jsonArray = array(
	    			'element' => array(
					    "ElementSymbol" => utf8_encode($row['Symbol']),
					    "ElementName" => utf8_encode($row['Name']),
					    "AtomicNumber" => (int)$row['AtomicNumber'],
					    "AtomicWeight" => (float)$row['AtomicWeight'],
					    "PhysicalProperties" => $physicalProperties,
					    "MoreInfoLink" => utf8_encode($row['InfoLink']),
					    "BriefDescription" => utf8_encode($row['BriefDescription'])
			    	)
				);

				$filename = "$atomicNumber.json";
				// create our json file!
		    	$fileHandle   = fopen($filename, 'w') or die('Cannot open file:  '.$my_file);
		    	// write to our new file
		    	fwrite($fileHandle, json_encode($jsonArray));
		    	// close the file
				fclose($fileHandle);
				echo "<p>Successfully created '$filename'!</p>";
				echo '<p>';
				var_dump($jsonArray);
				echo '</p>';
				echo '<p>';
				var_dump(error_get_last());
				echo '</p>';
				/*
				echo '<p>';
				var_dump(($jsonArray));
				echo '</p>';
				echo '<p>';
				var_dump(json_encode($jsonArray));
				echo '</p>';
				*/
	
		    }

		    $dbh = null;
		} catch (PDOException $e) {
		    echo "Error!: " . $e->getMessage() . "<br/>";
		    die();
		}

	?>
