export default {
  "id": "index",
  "tenant": "blog-add-on-app",
  "title": "FormulaDB Themes",
  "sections": [
    {
      "id": "indexS2",
      "component": "COVER",
      "title": "Our Blog",
      "body": "Lead paragraph providing a short introduction to you blog.&nbsp;\n                    <br>\n                ",
      "mediaUrl": "/formuladb-env/frmdb-apps/base-app/static/bg1.jpg",
      "mediaType": "IMAGE"
    },
    {
      "id": "indexS3",
      "component": "CARDS_IMG",
      "title": "Blog Posts",
      "subtitle": "Section lead paragraph, some text about the content described in this section.",
      "subSections": [
        {
          "id": "indexS3sS1",
          "component": "CARD_IMG",
          "title": "Post 1",
          "mediaUrl": "/formuladb-env/frmdb-apps/blog-add-on-app/static/blog-post-1.png",
          "mediaType": "IMAGE",
          "info": "\n                    <span>INFO \n                        <small>info</small>\n                    </span>\n                ",
          "action": "\n                    <a href=\"./blog-post-1.html\" class=\"position-relative\" data-frmdb-value=\"\" data-frmdb-attr=\"href:CONCATENATE('./', name, '.html'):$FRMDB.$Page[]\">Read Post</a>\n                "
        },
        {
          "id": "indexS3sS2",
          "component": "CARD_IMG",
          "title": "Post 2",
          "mediaUrl": "/formuladb-env/frmdb-apps/blog-add-on-app/static/blog-post-2.png",
          "mediaType": "IMAGE",
          "info": "\n                    <span>INFO \n                        <small>info</small>\n                    </span>\n                ",
          "action": "\n                    <a href=\"./blog-post-2.html\" class=\"position-relative\" data-frmdb-attr=\"href:CONCATENATE('./', name, '.html'):$FRMDB.$Page[]\">Read Post</a>\n                "
        },
        {
          "id": "indexS3sS3",
          "component": "CARD_IMG",
          "title": "Blog Post 3",
          "mediaUrl": "/formuladb-env/frmdb-apps/blog-add-on-app/static/blog-post-3.png",
          "mediaType": "IMAGE",
          "info": "\n                    <span>INFO \n                        <small>info</small>\n                    </span>\n                ",
          "action": "\n                    <a href=\"./blog-post-3.html\" class=\"position-relative\" data-frmdb-attr=\"href:CONCATENATE('./', name, '.html'):$FRMDB.$Page[]\">Read Post</a>\n                "
        }
      ]
    },
    {
      "id": "indexS4",
      "component": "MEDIA",
      "mediaType": "IMAGE"
    },
    {
      "id": "indexS5",
      "component": "MEDIA",
      "title": "Section Heading",
      "body": "Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at\n                        convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.",
      "mediaUrl": "/formuladb-env/frmdb-apps/base-app/static/section1.jpg",
      "mediaType": "IMAGE",
      "action": "Call to Action"
    },
    {
      "id": "indexS6",
      "component": "CARDS_ICO",
      "title": "Cards with Icons",
      "subtitle": "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.",
      "subSections": [
        {
          "id": "indexS6sS1",
          "component": "CARD_ICON",
          "mediaUrl": "fontawesome-solid-utensils-cutlery-dining-dinner-eat-food-fork-knife-restaurant",
          "mediaType": "ICON"
        },
        {
          "id": "indexS6sS2",
          "component": "CARD_ICON",
          "mediaUrl": "fontawesome-solid-biking-bicycle-bike-cycle-cycling-ride-wheel",
          "mediaType": "ICON"
        },
        {
          "id": "indexS6sS3",
          "component": "CARD_ICON",
          "mediaUrl": "fontawesome-solid-car-auto-automobile-sedan-transportation-travel-vehicle",
          "mediaType": "ICON"
        },
        {
          "id": "indexS6sS4",
          "component": "CARD_ICON",
          "mediaUrl": "fontawesome-solid-tv-computer-display-monitor-television",
          "mediaType": "ICON"
        },
        {
          "id": "indexS6sS5",
          "component": "CARD_ICON",
          "mediaUrl": "fontawesome-solid-glass-martini-alt-alcohol-bar-beverage-drink-liquor",
          "mediaType": "ICON"
        },
        {
          "id": "indexS6sS6",
          "component": "CARD_ICON",
          "mediaUrl": "fontawesome-solid-building-apartment-business-city-company-office-work",
          "mediaType": "ICON"
        }
      ]
    },
    {
      "id": "indexS7",
      "component": "MEDIA",
      "title": "Section Heading",
      "body": "Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in\n                        fringilla ligula finibus.",
      "mediaUrl": "/formuladb-env/frmdb-apps/base-app/static/section2.jpg",
      "mediaType": "IMAGE",
      "action": "Call to Action"
    }
  ]
}