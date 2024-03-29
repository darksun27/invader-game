var questionData = [
  {
    question: "Which company created  the Javascript",
    option: ["Netscape", "Mozilla", "Apple", "Microsoft"],
    hint: "Firefox...?",
    correctoption: 1
  },
  {
    question:
      "What is the ouput of the program\nvar x = 10;\n x = x + 5; \nconsole.log(x);",
    option: [15, 10, 5, -10],
    hint: "1+2=3",
    correctoption: 0
  },
  {
    question: "What is the output of the program \nconsole.log(-5/0);",
    option: [0, "- Infinity", "+ Infinity", "None of the above"],
    hint: "",
    correctoption: 1
  },
  {
    question:
      "What is the output of the program \nconsole.log(3+5+&quot;5&quot;);",
    option: [355, 13, 85, "None of the above"],
    hint: "Think about the coercion",
    correctoption: 2
  },
  {
    question: "Inside which HTML element do we put the JavaScript?",
    option: [
      "&lt;script&gt;",
      "&lt;js&gt;",
      "&lt;javascript&gt;",
      "&lt;scripting&gt;"
    ],
    hint: "Javascript is a scripting language which runs on scripts",
    correctoption: 0
  },
  {
    question:
      "What is the correct syntax for referring to an external script called &quot;xxx.js&quot;?",
    option: [
      "&lt;script name = “xxx.js”&gt;",
      "&lt;script href = “xxx.js”&gt;",
      "&lt;script src=”xxx.js”&gt;",
      "&lt;script import=”xxx.js”&gt;"
    ],
    hint: "Javascript is a scripting language which runs on scripts",
    correctoption: 2
  },
  {
    question:
      "What is the correct JavaScript syntax to change the content of the HTML element below?\n&lt;p id=`demo`&gt;This is a demonstration.&lt;/p&gt;",
    option: [
      "#demo.innerHTML = “Hello World!”;",
      "document.getElement(“p”).innerHTML = “Hello World!”;",
      "document.getElementByName(“p”).innerHTML = “Hello World!”;",
      "document.getElementById(“demo”).innerHTML = “Hello World!”"
    ],
    hint: "document helps to manipulate the html",
    correctoption: 3
  },
  {
    question: "Where is the correct place to insert a JavaScript?",
    option: [
      "The &lt;body&gt; section",
      "Both the &lt;head&gt; section and the &lt;body&gt; section are correct",
      "The &lt;head&gt; section",
      "In the &lt;html&gt; section"
    ],
    hint: "after html and css javascript should be executed!!",
    correctoption: 0
  },
  {
    question:
      "The external JavaScript file must contain the &lt;script&gt; tag.",
    option: ["True", "False", "Depends upon the scenario", "Can’t say"],
    hint: "js is written under the script tag",
    correctoption: 1
  },
  {
    question: "How do you write `Hello World` in an alert box?",
    option: [
      "alertBox(“Hello World”);",
      "alert(“Hello World”);",
      "msg(“Hello World”);",
      "msgBox(“Hello World”);"
    ],
    hint: "",
    correctoption: 1
  },
  {
    question: "How to write an IF statement in JavaScript?",
    option: ["if(i==5)", "if i==5 then", "if i=5", "if i=5 then"],
    hint: "",
    correctoption: 0
  },
  {
    question:
      "How to write an IF statement for executing some code if `i` is NOT equal to 5?",
    option: ["if i &lt;&gt; 5", "if(i&lt;&gt;5)", "if(i!=5)", "if(i!=5)then"],
    hint: "",
    correctoption: 2
  },
  {
    question: "How does a WHILE loop start?",
    option: [
      "while i=1 to 10",
      "while(i&lt;=10)",
      "while(i&lt;=10;i++)",
      "whlile(i=0)"
    ],
    hint: "",
    correctoption: 1
  },
  {
    question: "How can you add a comment in a JavaScript?",
    option: [
      "`this is the comment",
      "&lt;!--this is the comment--&gt;",
      "//this is the comment",
      "you don't have a comment"
    ],
    hint: "",
    correctoption: 2
  }
];
