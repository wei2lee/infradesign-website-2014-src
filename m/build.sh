#!/bin/sh
ls -la $1 | awk -v dir=$1 '{print("{\"type\":\"SCRIPT\", \"size\":"$5", \"stopExecution\":false, \"source\":\""dir"/"$9"\"},"); }'
#ls -la $1 | awk -v dir=$1 '{print("{\"type\":\"IMAGE\", \"size\":"$5", \"source\":\""dir"/"$9"\"},"); }'
#ls -la $1 | awk -v dir=$1 '{print("{\"type\":\"CSS\", \"size\":"$5", \"source\":\""dir"/"$9"\"},"); }'