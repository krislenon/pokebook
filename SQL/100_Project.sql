create database project;
create table user(user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,email VARCHAR(50) NOT NULL, CONSTRAINT AK_EMAIL UNIQUE(email),fullname TEXT NOT NULL,password TEXT NOT NULL);
create table post(post_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,likes INT,authorname TEXT,fk_author_id INT,FOREIGN KEY(fk_author_id) references user(user_id),postmsg TEXT);
create table comment(comment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,authorname TEXT,fk_author_id INT,FOREIGN KEY(fk_author_id) references user(user_id),parent_comment INT,commentmsg TEXT);
create table friends(fk_user_id INT, FOREIGN KEY(fk_user_id) references user(user_id), friendid INT, FOREIGN KEY(friendid) references user(user_id), Accepted INT);
create table likes(fk_user_id INT,FOREIGN KEY(fk_user_id) references user(user_id),fk_post_id INT,FOREIGN KEY(fk_post_id)references post(post_id),fk_comment_id INT,FOREIGN KEY(fk_comment_id)references comment(comment_id));
ALTER TABLE `post` ADD `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `postmsg`;
ALTER TABLE `comment` CHANGE `parent_comment` `fk_post_id` INT(11) NULL DEFAULT NULL;
ALTER TABLE `comment` ADD FOREIGN KEY (`fk_post_id`) REFERENCES `post`(`post_id`);
ALTER TABLE `comment` ADD `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `commentmsg`;
/*insert into user(email,fullname,password) values ("abc@gmail.com","abcdefg",123),("def@gmail.com","abcdefg",123);
insert into post(authorname,fk_author_id) values("abcdefg",(select user_id from user where fullname="abcdefg"));
insert into comment(authorname,fk_author_id,parent_comment) values("abcdefg",(select user_id from user where fullname="abcdefg"),2);
insert into friends(fk_user_id,friendid,Accepted) values ((select user_id from user where fullname="abcdefg"),1,0);
insert into likes(fk_user_id,fk_post_id,fk_comment_id) values ((select user_id from user where fullname="abcdefg"),(select post_id from post where authorname="abcdefg"),(select comment_id from comment where authorname="abcdefg"));*/