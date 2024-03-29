$(document).ready(function () {
  // Fetch and display books
  function fetchBooks() {
    $.get("http://localhost:8080" + "/books", function (results) {
      // Clear the table body before adding new books
      $("#kirjaLista tbody").empty();

      // Loop through the results and append each book to the table
      results.forEach(function (kirja) {
        $("#kirjaLista tbody").append(
          `<tr>
                    <td>${kirja.idkirja}</td>
                    <td><a href="#" class="kirjanimi-link" data-book-id="${kirja.idkirja}">${kirja.kirjanimi}</a></td>
                    <td>${kirja.kirjailija}</td>
                    <td>${kirja.julkaisuvuosi}</td>
                    <td>${kirja.kuvaus}</td>
                    <td>${kirja.kirjasarja}</td>
                    <td> <button class="lisaanappi" data-id="${kirja.idkirja}">Lisää teos</button> </td>
                </tr>`
        );
      });

      // Attach click event handler to the buttons
      $(".lisaanappi").on("click", function () {
        var idkirja = $(this).data("id");
        var clickedKirja = results.find((kirja) => kirja.idkirja === idkirja);
        lisaa(clickedKirja);
      });
    });
  }

  function lisaa(kirja) {
    console.log("toimii");

    var kirjadata = {
      kirjanimi: kirja.kirjanimi,
      painovuosi: kirja.julkaisuvuosi,
      kuvaus: kirja.kuvaus,
      id: kirja.idkirja,
      idkirjasarja: kirja.idkirjasarja,
    };

    $.ajax({
      url: "http://localhost:8080/bookCopies",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(kirjadata),
      success: function () {
        console.log("Book added successfully");
      },
      error: function (xhr, status, error) {
        console.error("Error adding book:", error);
      },
    });
  }

  function fetchBookCopies() {
    $.get("http://localhost:8080" + "/bookCopies", function (results) {

      // Clear the table body before adding new books
      $("#omakirjalista tbody").empty();

      // Loop through the results and append each book to the table
      results.forEach(function (kirja) {
        var kirjakopioId = kirja.idkirjakopio;
        $("#omakirjalista tbody").append(
          `<tr>
                    <td>${kirja.kirjanimi}</td>
                    <td>${kirja.painovuosi}</td>
                    <td>${kirja.hankintahinta}</td>
                    <td>${kirjakopioId}</td>
                    <td>
                        <button class="muokkaaButton" data-kirjakopio-id="${kirjakopioId}">Muokkaa</button>
                        <button class="poistaButton" data-kirjakopio-id="${kirjakopioId}">Poista</button>
                    </td>
                </tr>`
        );
      });
    });
  }

  // Haetaan sarjat
  function fetchSeries() {
    $.get("http://localhost:8080" + "/bookSeries", function (results) {
      // Clear the table body before adding new books
      $("#sarjalista ").empty();
      results.forEach(function (sarja) {
        $("#sarjalista").append(
          `<option value="${sarja.kirjasarja}">${sarja.kirjasarja}</option>`
        );
      });
    });
  }
  // Haetaan hyllyt
  function fetchShelves() {
    $.get("http://localhost:8080" + "/bookShelf", function (results) {
      //
      $("#hyllylista ").empty();
      results.forEach(function (hylly) {
        $("#hyllylista").append(
          `<option value="${hylly.omistaja}">${hylly.omistaja}</option>`
        );
      });
    });

    //Hyllyn lisääminen
    $("#addNewShelfForm").submit(function (e) {
      e.preventDefault();
      var omistaja = $("#omistaja").val();
      var shelfData = {
        omistaja: omistaja,
      };
      $.ajax({
        url: "http://localhost:8080" + "/bookShelf",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(shelfData),
        success: function () {},
      });
    });

    //Sarjan lisääminen
    $("#addSeriesForm").submit(function (e) {
      e.preventDefault();

      var sarjanimi = $("#sarjanimi").val();
      var kustantaja = $("#kustantaja").val();
      var kuvaus = $("#kuvaus").val();
      var luokittelu = $("#luokittelu").val();

      var seriesData = {
        sarjanimi: sarjanimi,
        kustantaja: kustantaja,
        kuvaus: kuvaus,
        luokittelu: luokittelu,
      };
      $.ajax({
        url: "http://localhost:8080" + "/bookSeries",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(seriesData),
        success: function () {
          fetchBooks();
        },
      });
    });
  }

  //teoksen lisääminen
  $("#addNewBookForm").submit(function (e) {
    e.preventDefault();

    var kirjanimi = $("#kirjanimi").val();
    var julkaisuvuosi = $("#julkaisuvuosi").val();
    var kuvaus = $("#kuvaus").val();
    var kirjailija = $("#kirjailija").val();
    var kirjasarja = $("#sarjalista").val();

    var bookData = {
      kirjanimi: kirjanimi,
      julkaisuvuosi: julkaisuvuosi,
      kuvaus: kuvaus,
      kirjailija: kirjailija,
      kirjasarja: kirjasarja,
    };

    //Convert this to use $.ajax for consistency
    $.ajax({
      url: "http://localhost:8080" + "/books",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(bookData),
      success: function () {
      },
    });
  });

  fetchBookCopies();
  fetchBooks();
  fetchShelves();
  fetchSeries();

  // AVAA KIRJAN TIEDOT KIRJA SIVULLA
  $(document).on("click", ".kirjanimi-link", function (e) {
    e.preventDefault();

    $("#infoWindow tbody").html("");

    // Get the book ID from the clicked link
    bookId = $(this).data("book-id");

    // Update the URL with the book ID
    window.history.pushState(null, null, `?book=${bookId}`);

    // Fetch details of the clicked book
    $.get(`http://localhost:8080/books/${bookId}`, function (book) {
      // Display the details of the clicked book in the infoWindow div
      $("#infoWindow tbody").html(
        `<tr>
                  <td>${book[0].idkirja}</td>
                  <td>${book[0].kirjanimi}</td>
                  <td>${book[0].kirjailija}</td>
                  <td>${book[0].julkaisuvuosi}</td>
                  <td>${book[0].kuvaus}</td>
                </tr>`
      );

      // Show the infoWindow
      $("#infoWindow").show();
    });
  });

  //CLOSE nappi
  $("#infoWindow .closeButton").click(function () {
    window.history.replaceState(null, null, window.location.pathname);
    $("#infoWindow").hide();
  });

  // AVAA KIRJAN TIEDOT KIRJAHYLLYSSÄ
  $(document).on("click", ".kirjanimi-link2", function (e) {
    e.preventDefault();

    $("#infoWindow2 tbody").html("");

    // Get the book ID from the clicked link
    bookId = $(this).data("book-id");
    console.log(bookId);
    // Update the URL with the book ID
    window.history.pushState(null, null, `?book=${bookId}`);

    // Fetch details of the clicked book
    $.get(`http://localhost:8080/bookCopies/${bookId}`, function (book) {
      console.log(book);
      function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Usage:
    const myyntipvmFormatted = formatDate(book[0].myyntipvm);
    const hankintapvmFormatted = formatDate(book[0].hankintapvm);
      $("#infoWindow2 tbody").html(
        `<tr>
                  <td>${book[0].idkirjakopio}</td>
                  <td>${book[0].kirjanimi}</td>
                  <td>${book[0].kirjailija}</td>
                  <td>${book[0].painovuosi}</td>
                  <td>${book[0].kuvaus}</td>
                  <td>${book[0].hankintahinta}</td>
                  <td>${book[0].jarjestysnumero}</td>
                  <td>${book[0].julkaisuvuosi}</td>
                  <td>${book[0].kunto}</td>
                  <td>${book[0].myyntihinta}</td>
                  <td>${myyntipvmFormatted}</td>
                  <td>${hankintapvmFormatted}</td>
                  <td>${book[0].painos}</td>
                  <td>${book[0].painovuosi}</td>
                </tr>`
      );

      $("#infoWindow2").show();
    });
  });

  //CLOSE nappi
  $("#infoWindow2 .closeButton").click(function () {
    window.history.replaceState(null, null, window.location.pathname);
    $("#infoWindow2").hide();
  });

  // Call fetchBooks function when the document is ready
  fetchBooks();
});

$(document).ready(function() {
  findbook2();
});

$(document).ready(function () {
  $(document).on("input", "#findbook2", findbook2);
});

function findbook2() {
// Get the value from the input field
var searchTerm = $("#findbook2").val();

// Make AJAX request with the search term
$.get("http://localhost:8080/bookCopiess/" + searchTerm, function (results2) {
  // Clear the table body before adding new books
  $("#omakirjalista tbody").empty();

  // Loop through the results and append each book to the table
  results2.forEach(function (kirja) {
    var kirjakopioId = kirja.idkirjakopio;
    $("#omakirjalista tbody").append(
      `<tr>
                <td><a href="#" class="kirjanimi-link2" data-book-id="${kirjakopioId}">${kirja.kirjanimi}</a></td>
                <td>${kirja.painovuosi}</td>
                <td>${kirja.hankintahinta}</td>
                <td>${kirjakopioId}</td>
                <td>
                    <button class="muokkaaButton" data-kirjakopio-id="${kirjakopioId}">Muokkaa</button>
                    <button class="poistaButton" data-kirjakopio-id="${kirjakopioId}">Poista</button>
                </td>
            </tr>`            
    );
  });

        //POISTA NAPPI TOIMINTA
        $(".poistaButton").click(function () {
          var kirjakopioId = $(this).data("kirjakopio-id");
          deleteBookCopy(kirjakopioId);
        });
        //MUOKKAA NAPPI TOIMINTA, KIITOS LAURI <3
        $(".muokkaaButton").click(function () {
          var kirjakopioId = $(this).data("kirjakopio-id");
          editBookCopy(kirjakopioId);
        });
});
}

findbook();
$(document).ready(function () {
  $(document).on("input", "#findbook", findbook);
});

function findbook() {
  // Get the value from the input field
  var searchTerm = $("#findbook").val();

  // Make AJAX request with the search term
  $.get("http://localhost:8080/bookss/" + searchTerm, function (results) {
    // Clear the table body before adding new books
    $("#kirjaLista tbody").empty();

    // Loop through the results and append each book to the table
    results.forEach(function (kirja) {
      $("#kirjaLista tbody").append(
        `<tr>
          <td>${kirja.idkirja}</td>
          <td><a href="#" class="kirjanimi-link" data-book-id="${kirja.idkirja}">${kirja.kirjanimi}</a></td>
          <td>${kirja.kirjailija}</td>
          <td>${kirja.julkaisuvuosi}</td>
          <td>${kirja.kuvaus}</td>
          <td>${kirja.kirjasarja}</td>
          <td> <button class="lisaanappi" data-id="${kirja.idkirja}">Lisää teos</button> </td>
        </tr>`
      );
      
    });
    $(".lisaanappi").on("click", function () {
      var idkirja = $(this).data("id");
      var clickedKirja = results.find((kirja) => kirja.idkirja === idkirja);
      lisaa(clickedKirja);
    });
  });
}

function lisaa(kirja) {
  console.log("toimii");

  var kirjadata = {
    kirjanimi: kirja.kirjanimi,
    painovuosi: kirja.julkaisuvuosi,
    kuvaus: kirja.kuvaus,
    id: kirja.idkirja,
    idkirjasarja: kirja.idkirjasarja,
  };

  $.ajax({
    url: "http://localhost:8080/bookCopies",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(kirjadata),
    success: function () {
      console.log("Book added successfully");
    },
    error: function (xhr, status, error) {
      console.error("Error adding book:", error);
    },
  });
}

function editBookCopy(kirjakopioId) {
  var omakirjalista = document.getElementById("omakirjalista");
  omakirjalista.innerHTML = "";
  fetchBookCopies2(kirjakopioId);
}

function fetchBookCopies2(kirjakopioId) {
  var footer = document.getElementsByTagName("footer")[0];
  footer.style.display = "none";

  $("#findbook2").hide();

  $.get("http://localhost:8080/bookCopies/" + kirjakopioId, function (results) {
    $("#kirjaLista tbody").empty();

    // Loop through the results and append each book to the table
    results.forEach(function (kirja) {
      // Preprocess values to replace null with 0 or remove them
      const kirjanimi = kirja.kirjanimi || ""; // If kirja.kirjanimi is null, it will be replaced with an empty string
      const painos = kirja.painos || "";
      const painovuosi = kirja.painovuosi || "";
      const hankintahinta = kirja.hankintahinta || "";
      const hankintapvm = kirja.hankintapvm
        ? adjustDateToTimeZone(kirja.hankintapvm)
        : ""; // Format date
      const kunto = kirja.kunto || "";
      const kuvaus = kirja.kuvaus || "";
      const myyntipvm = kirja.myyntipvm
        ? adjustDateToTimeZone(kirja.myyntipvm)
        : ""; // Format date
      const myyntihinta = kirja.myyntihinta || "";
      const jarjestysnumero = kirja.jarjestysnumero || "";

      function adjustDateToTimeZone(dateString) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        const localDate = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
          )
        );
        return localDate.toISOString().split("T")[0];
      }

      $("#omakirjalista").append(`

          <div class="formContainer1" id="formContainer1">
          <form id="addNewBookForm">

          <h2>Muokkaa kirjan tietoja</h2>

                  <label for="kirjanimi">Teoksen nimi:</label>
                  <input type="text" id="kirjanimi" name="kirjanimi" value="${kirjanimi}" required>

                  <label for="">Painos:</label>
                  <input type="number" id ="painos" name="" min="1" max="1000000" value="${painos}" required>

                  <label for="">Painovuosi:</label>
                  <input type="number" id="painovuosi" name="" min="1970" max="2069" value="${painovuosi}" required>
        
                  <label for="">Hankintahinta:</label>
                  <input type="number" id ="hankintahinta" name="" min="0" max="9999.99" value="${hankintahinta}" required>

                  <label for="">Kunto:</label>
                  <input type="number" id ="kunto" name="" min="1" max="5" value="${kunto}" required>
  
                  <label for="kuvaus">kuvaus:</label>
                  <input type ="text" id="kuvaus" name="kuvaus" value="${kuvaus}" required>
            
                  <label for="">Myyntihinta:</label>
                  <input type="number" id ="myyntihinta" name="" min="0" max="9999.99" value="${myyntihinta}" required>

                  <label for="">Järjestysnumero</label>
                  <input type="number" id ="jarjestysnumero" name="" min="1" max="1000000" value="${jarjestysnumero}" required>

                  <br>
                  <br>
                  
                  <label for="">Hankinta päivämäärä:</label>
                  <input type="date" id ="hankintapvm" name="" value="${hankintapvm}" required>

                  <br>
                  <br>
                  
                  <label for="">Myynti päivämäärä:</label>
                  <input type="date" id ="myyntipvm" name="" value="${myyntipvm}" required>

                  <br>
                  <br>
 
                  <button class="tallennaButton" >Tallenna</button>
                  <a href="oma_kirjahylly.html">Peruuta</a>
                  </form>
          </form>
          </div>

          <tbody>
              <!-- Books will be appended here -->
          </tbody>
      `);

      $(".tallennaButton").click(function () {
        var kirjanimi = $("#kirjanimi").val();
        var painos = $("#painos").val();
        var painovuosi = $("#painovuosi").val();
        var hankintahinta = $("#hankintahinta").val();
        var hankintapvm = $("#hankintapvm").val();
        var kunto = $("#kunto").val();
        var kuvaus = $("#kuvaus").val();
        var myyntipvm = $("#myyntipvm").val();
        var myyntihinta = $("#myyntihinta").val();
        var jarjestysnumero = $("#jarjestysnumero").val();
        var kirjakopioid = kirjakopioId;

        var se1Data = {
          kirjanimi: kirjanimi,
          painos: painos,
          painovuosi: painovuosi,
          hankintahinta: hankintahinta,
          hankintapvm: hankintapvm,
          kunto: kunto,
          kuvaus: kuvaus,
          myyntipvm: myyntipvm,
          myyntihinta: myyntihinta,
          jarjestysnumero: jarjestysnumero,
          idkirjakopio: kirjakopioId,
        };
        $.ajax({
          url: "http://localhost:8080/bookCopies",
          method: "PUT",
          contentType: "application/json",
          data: JSON.stringify(se1Data),
          success: function () {
          },
        });
      });
    });
  });
}

function deleteBookCopy(kirjakopioId) {
  // Here you should make an AJAX call to your server to delete the book copy
  $.ajax({
    url: "http://localhost:8080/bookCopies/" + kirjakopioId,
    type: "DELETE",
    success: function (response) {
      // Assuming successful deletion, you can remove the row from the table
      $("#omakirjalista tbody tr").each(function () {
        if ($(this).find("td:eq(3)").text() == kirjakopioId) {
          $(this).remove();
          return false; // Break the loop once row is removed
        }
      });
    },
    error: function (xhr, status, error) {
      alert("Virhe poistettaessa kirjakopiota: " + error);
    },
  });
}

function findbookbyshelf() {
  
  var searchTerm = $("#hyllylista").val();
console.log("toimii")
  
  $.get("http://localhost:8080/bookss/" + searchTerm, function (results) {
    // Clear the table body before adding new books
    $("#kirjaLista tbody").empty();

    // Loop through the results and append each book to the table
    results.forEach(function (kirja) {
      $("#kirjaLista tbody").append(
        `<tr>
          <td>${kirja.idkirja}</td>
          <td><a href="#" class="kirjanimi-link" data-book-id="${kirja.idkirja}">${kirja.kirjanimi}</a></td>
          <td>${kirja.kirjailija}</td>
          <td>${kirja.julkaisuvuosi}</td>
          <td>${kirja.kuvaus}</td>
          <td>${kirja.kirjasarja}</td>
          <td> <button class="lisaanappi" data-id="${kirja.idkirja}">Lisää teos</button> </td>
        </tr>`
      );
    });
  });
}

$(document).ready(function () {
  $(document).on("click", "#login", login);
  $(document).on("click", "#register", register);
  $(document).on("change", "#hyllylista", findbookbyshelf);
});

function login() {
  // Get the value from the input field
  var usernamefront = $("#username").val();
  var passwordfront = $("#password").val();
  console.log(usernamefront);
  console.log(passwordfront);

  var logindata = {
    username: usernamefront,
    password: passwordfront
  };

  $.ajax({
    url: "http://localhost:8080/login/" + usernamefront,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(logindata),
    success: function(results) {
      console.log("nyt ollaan kirjautuneita");
      // Assuming that your navigation has an id of "navigoint"
      $("#navigoint").append("<a href='lisaaUusiTeos.html'>Lisää teos</a> <a href='lisaauusihylly.html'>Lisää uusi kirjahylly</a>  <a href='lisaauusisarja.html'>Lisää sarja</a>");
    },
    error: function(xhr, status, error) {
      console.error(error);
    }
  });
}

function register() {
  // Get the value from the input field
  var usernamefront = $("#registerusername").val();
  var passwordfront = $("#registerpassword").val();
  console.log(usernamefront);
  console.log(passwordfront);

  var registerdata = {
    username: usernamefront,
    password: passwordfront
  };

  $.ajax({
    url: "http://localhost:8080/register",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(registerdata),
    success: function (results) {
      console.log("Käyttäjä luotu onnistuneesti");
     alert("Käyttäjä luotu onnistuneesti");
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  });
}