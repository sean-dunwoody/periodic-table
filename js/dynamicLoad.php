<?php

	$host   = 'localhost';
	$dbname = 'periodta_PeriodicTable';
	$user   = 'periodta_admin';
	$pass   = 'd11_.~;8874[E7E';

	try {
		$DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
		$DBH->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e) {
		echo "Error connecting to Database";
	}

	if($_GET['AtomicNumber']) {	
		$number = $_GET['AtomicNumber'];	
		try {
			// Querying the database
			$STH = $DBH->query("SELECT `AtomicNumber`, `AtomicWeight`, `Name`, `Symbol`, `BriefDescription`, `GroupID`,`Group`, `PointName`, `PointValue` FROM `ElementTable`, `GroupTable`, `PointsTable` WHERE ElementTable.AtomicNumber=$number AND GroupTable.ID=ElementTable.GroupId AND PointsTable.PAtomicNumber=$number");
			// Setting the fetch mode
			$STH->setFetchMode(PDO::FETCH_ASSOC); 
			
			$row = $STH->fetch();
			echo ' <span class="heading">',$row['Name'],'</span>
					<div class="content">
						<div class="information">
							<p><strong>Atomic number: </strong> ',$row['AtomicNumber'],'</p>
							<p><strong>Atomic weight: </strong> ',$row['AtomicWeight'],' u</p>
							<p><strong>Protons: </strong> ',$row['AtomicNumber'],'</p>
							<p><strong>Neutrons: </strong> ',$row['AtomicWeight'],'</p>
							<p><strong>Electrons: </strong> ',$row['AtomicNumber'],'</p>
							<p><strong>',$row['PointName'],': </strong> ',$row['PointValue k'],' (-259.14 °C)</p>';
			while($row = $STH->fetch()) {
				echo '<p><strong>',$row['PointName'],': </strong> ',$row['PointValue k'],' (-259.14 °C)</p>';
			}
			echo '	</div>
				</div>
			<a href="http://en.wikipedia.org/wiki/Hydrogen" target="_blank" class="explore-link"><span>More information</span></a>';
			
		} 
		catch(PDOException $e) {
			echo "Error copmleting query";
		}
	}
				

?>
