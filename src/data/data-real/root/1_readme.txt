readme.txt


Die folgenden Dateien werden zur Verfügung gestellt:


1.1 readme.txt (Diese Textdatei)


1.2 Eine CSV-Datei mit den Nummern und Texten der Gebiete (Wahlkreise, Länder, Bund)
    Stand: Bundestagswahl 2017

    Die Reihenfolge der Gebiete wird durch die Wahlkreisnummer bestimmt.

    btw17_wahlkreise_laender_bezeichnungen.csv


1.3 Eine CSV-Datei mit allen deutschen Gemeinden und ihrer Wahlkreiszugehörigkeit
    Gebietsstand: 28.02.2017 (die Datei wird vor der Wahl zum aktuellen Gebietsstand aktualisiert)

    btw17_wahlkreise_gemeinden_20170228.csv


1.4 Eine CSV-Datei mit den verwendeten Gruppennummern und Bezeichnungen der Parteien und Einzelbewerber sowie der Reihenfolge im Bund.
    Stand: Bundestagswahl 2017

    btw17_parteien.csv


1.5 Eine CSV-Datei mit der Reihenfolge der Kreiswahlvorschläge und Landeslisten auf den Stimmzetteln innerhalb der Länder
    Stand: Bundestagswahl 2017

    btw17_parteireihenfolge_laender.csv



2.1 Download-Verzeichnis mit xsd-Schemata

   
2.2 Ergebnisdateien "ergX_yyyyyVV.xml" ; VV Version aufsteigend
    Stand: Beispieldatei

      Wahlnacht 24.09./25.09.2017 - aktuelle Ergebnisdaten
          X = 0, also erg0_ 00099 = Bundesgebiet, VV Version aufsteigend z.B. erg0_0009902.xml
          X = 1, also erg1_ 000xx = Bundesland (xx = 01-16), VV Version aufsteigend z.B. erg1_0000102.xml
          X = 3, also erg3_ 00yyy = Wahlkreis  (yyy = 001-299), VV Version aufsteigend z.B. erg3_0006101.xml

    In einem Ergebniseingang befinden sich Dateninformationen:

    - bis zur Verkündung des amtlichen vorläufigen Ergebnisses:
      Zwischenergebnisse (00yyy):
      - Wahlkreisergebnis (neu bzw. korrigiert)
      - Landesergebnis    (Zwischenergebnis)
      - Bundesergebnis    (Zwischenergebnis)

    - nach Verkündung des amtlichen vorläufigen Ergebnis:
      Vorläufige Ergebnisse (000xx / 00099):
      - Landesergebnis      (Vorläufiges Ergebnis)
      - Bundesergebnis      (Vorläufiges Ergebnis)

    Die Dateien werden in chronologischer Reihenfolge des Ergebniseingangs abgelegt.
    Im Verlauf der Wahlnacht können Ergebnisse auch korrigiert werden!

	  Die für die Medien bereitgestellten Dateien müssen keine lückenlosen Versionsnummern haben, sie sind aber aufsteigend.
   

2.3 Ergebnisdatei "sitze_VV.xml" ; VV Version aufsteigend
    Stand: Beispieldatei 

    Wahlnacht 24.09./25.09.2017 - vorläufige Ergebnisdatei

    Nach Verkündung des amtlichen vorläufigen Ergebnisses wird die Ergebnisdatei eingestellt.
    Z. B. sitze_02.xml


2.4 Ergebnisdatei "gewaehlte_VV.xml" ; VV Version aufsteigend
    Stand: Beispieldatei

    Wahlnacht 24.09./25.09.2017 - vorläufige Ergebnisdatei

    Nach Verkündung des amtlichen vorläufigen Ergebnisses wird die Ergebnisdatei eingestellt.
    Z. B. gewaehlte_02.xml


2.5 Ergebnisdatei "gesamtergebnis_VV.xml" ; VV Version aufsteigend
    Stand: Beispieldatei

    Wahlnacht 24.09./25.09.2017 - vorläufige Ergebnisdatei

    Nach Verkündung des amtlichen vorläufigen Ergebnisses wird die Ergebnisdatei eingestellt.
    Z. B. gesamtergebnis_02.xml


2.6 Download-Verzeichnis mit xml-Dateien


3.1 Ein TXT-Dokument mit der Beschreibung der Ergebnisdatei im csv-Format

    ergebnisdatei_csv_beschreibung.txt


3.2 Ergebnisdatei "kerg_VVVVV.csv" ; VVVVV Version aufsteigend
    Stand: Beispieldatei

    Wahlnacht 24.09./25.09.2017 - aktuelle Ergebnisdatei (lfd. Aktualisierung)

    In einer CSV-Datei werden Ergebnisse bereitgestellt,
    die Parteireihenfolge im Tabellenkopf ist die Bundesreihenfolge.


3.3 Download-Verzeichnis mit CSV-Datei

    Nur aktuelle Ergebnisdatei
