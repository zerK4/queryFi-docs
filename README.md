### **Introducing Queryfi: The Ultimate Query Builder for Your Laravel API**

Are you tired of constantly jumping between your frontend and backend just to adjust filters, sort, paginate, or query related data(sounded like a commercial 😂)?

Meet **Queryfi** – the powerful package that enhances your API interactions with Laravel, offering the flexibility to build dynamic queries directly from your frontend, be it React or any other framework.

### **Why Queryfi?**

Laravel is an amazing framework with fine-grained control over database interactions, but when it comes to APIs, there’s often friction. You find yourself constantly switching between frontend and backend just to tweak a filter, sort order, or pagination. This back-and-forth slows down development and can lead to a less efficient workflow. **Queryfi** changes that. It allows you to perform advanced queries with ease, directly from your frontend, saving you time and reducing the complexity of interacting with the backend.

---

### **What Makes Queryfi Special?**

Queryfi streamlines API interactions by offering a rich set of features, allowing you to build, sort, paginate, and modify queries on the fly. No more manually adjusting API calls — Queryfi handles everything from complex filtering to related data fetching, making your API interactions smooth and efficient.

#### **Key Features:**
- **Dynamic Filtering**: Perform flexible `where` conditions with a variety of operators, directly in your frontend.
- **Relation Handling**: Automatically include related models with `with()`, and customize those relations with advanced query modifiers.
- **Flexible Ordering**: Order results by any column, and easily control sorting direction.
- **Effortless Pagination**: Handle pagination with ease, controlling both the number of results per page and which page to display.
- **Query Modifiers for Relations**: Apply filters and ordering to related data, without touching the main query.
- **Limit Control**: Limit the number of results returned, all from the frontend.
- **Custom Path Parameters**: Add dynamic path parameters to your API endpoints for even more flexibility.

---

### **How Does It Work?**

Queryfi is built on a simple, intuitive class that allows you to build complex queries without writing custom API endpoints every time. Here’s how it works:

#### **Example Usage**

```typescript
import { createQuery } from 'queryfi';

const query = createQuery('/api/users', {
  baseUrl: 'http://localhost:8000'
})
  .with(['posts', 'profile']) // Include related data
  .where({ name: 'John' }) // Filter by name
  .where([
    ['age', '>=', 30],
    ['email', 'like', '%doe%']
  ]) // Filter by age and email pattern
  .orderBy('name:desc') // Sort by name in descending order
  .limit(10) // Limit results to 10
  .paginate(10, 2) // Paginate with 10 results per page, on page 2

const url = query.build(); // Build the final URL for the API request

console.log(url);
```

In the above example, **Queryfi** generates the following API URL dynamically:

```
GET /users?with=posts,profile&where[name]=John&where[age][gte]=30&orderBy[name]=desc&limit=10&page=2
```

This clean, easy-to-read URL is ready for use in your frontend API calls.

---

### **Fully Type-Safe and Extensible**

Queryfi is built with **TypeScript** to ensure that your API calls are always type-safe. This helps you catch errors early during development, so you never have to worry about incorrect data formats or missing fields.

---

### **Check out the Documentation:**
Visit the official [Queryfi Documentation](#) to explore all the features, usage examples, and integration guides.
