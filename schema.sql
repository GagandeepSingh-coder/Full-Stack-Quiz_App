-- Example from schema.sql
CREATE DATABASE quiz_app;
USE quiz_app;
-- Tables: users, quizzes,questions,quiz_questions,responses,attempts,

-- MD5('password1') 
-- use these to insert sample users with hashed passwords
--python3 -c "import hashlib; print(hashlib.md5('password1'.encode()).hexdigest())" on terminal to get the hash and entered it in user table for all users created  by me
INSERT INTO users (first_name,last_name,username, password, role) VALUES 
('Gagandeep','Singh','admin',202cb962ac59075b964b07152d234b70, 'admin'),
('Naman','Singh', 'User1',1b6df9e3a754ea7d8631626063b30e8e, 'student'),
('Parth','Bijpuriya','User2', 07c42737453ddacd3ccbc06bc3f92c1f , 'student'),
('Ritik','Arora','User3',32250170a0dca92d53ec9624f336ca24 , 'student');

Insert Into quizzes(tittle,total_marks,duration) VALUES
(Quiz 1,50,20),
(Quiz 2,50,20);
(Quiz 3,100,20);

INSERT INTO questions (id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES
(1, 'What is the principle of Stack?', 'FIFO', 'LIFO', 'Random', 'Priority', 'B'),
(2, 'Which data structure follows FIFO?', 'Stack', 'Queue', 'Tree', 'Graph', 'B'),
(3, 'Which is not a type of linked list?', 'Singly', 'Doubly', 'Circular', 'Binary', 'D'),
(4, 'Time complexity of array access?', 'O(n)', 'O(log n)', 'O(1)', 'O(n^2)', 'C'),
(5, 'Binary search works on?', 'Unsorted array', 'Sorted array', 'Linked list', 'Stack', 'B'),
(6, 'Max children in binary tree?', '1', '2', '3', 'Infinite', 'B'),
(7, 'Which traversal uses queue?', 'DFS', 'BFS', 'Inorder', 'Preorder', 'B'),
(8, 'Hashing is used for?', 'Sorting', 'Searching efficiently', 'Traversal', 'Recursion', 'B'),
(9, 'Recursion is?', 'Looping', 'Function calling itself', 'Sorting', 'Searching', 'B'),
(10, 'Heap is?', 'Linear structure', 'Tree-based structure', 'Graph', 'Stack', 'B');